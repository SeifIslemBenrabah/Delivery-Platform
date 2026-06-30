import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
from app.config.settings import settings
from app.config.database import AsyncSessionLocal
from app.models.livreur import Livreur
from app.models.commande import CommandeOpt
from app.services.geocoder import geocode
from app.services.assignment import auto_assign_order
from app.services.optimizer import optimize_route_for_livreur
from app.kafka.producer import publish

logger = logging.getLogger(__name__)


async def start_consumer():
    consumer = AIOKafkaConsumer(
        "order.created",
        "livreur.position",
        "order.status.updated",
        bootstrap_servers=settings.kafka_brokers,
        group_id="ms-optimisation-group",
        value_deserializer=lambda v: json.loads(v.decode()),
        auto_offset_reset="earliest",
    )
    await consumer.start()
    logger.info("[Kafka] Consumer started — listening on order.created, livreur.position")

    try:
        async for msg in consumer:
            try:
                await _handle(msg.topic, msg.value)
            except Exception as e:
                logger.error("Error handling topic %s: %s", msg.topic, e)
    finally:
        await consumer.stop()


async def _handle(topic: str, event: dict):
    async with AsyncSessionLocal() as db:

        # ─── New order created ─────────────────────────────────────────────
        if topic == "order.created":
            id_commande    = event.get("idCommande")
            pickup_address = event.get("pickUpAddress")
            dropoff_address= event.get("dropOffAddress")

            # Geocode addresses
            pickup_coords  = await geocode(pickup_address)  if pickup_address  else None
            dropoff_coords = await geocode(dropoff_address) if dropoff_address else None

            order = CommandeOpt(
                id_commande=id_commande,
                status="PENDING",
                pickup_address= pickup_address,
                dropoff_address=dropoff_address,
                pickup_lat= pickup_coords[0]  if pickup_coords  else None,
                pickup_lng= pickup_coords[1]  if pickup_coords  else None,
                dropoff_lat=dropoff_coords[0] if dropoff_coords else None,
                dropoff_lng=dropoff_coords[1] if dropoff_coords else None,
            )
            db.add(order)
            await db.commit()
            await db.refresh(order)

            # Auto-assign to best livreur
            livreur_id = await auto_assign_order(db, order)
            if livreur_id:
                # Rebuild optimized route for that livreur
                route = await optimize_route_for_livreur(db, livreur_id)
                await publish("route.optimized", livreur_id, {
                    "idLivreur":  livreur_id,
                    "stops":      [s.model_dump() for s in route.stops],
                    "polyline":   route.polyline,
                    "distanceKm": route.distance_km,
                })

        # ─── Livreur position update ───────────────────────────────────────
        elif topic == "livreur.position":
            livreur_id = event.get("idLivreur") or event.get("livreurId")
            lat        = event.get("lat")
            lng        = event.get("lng")
            if not livreur_id or lat is None or lng is None:
                return

            existing = await db.get(Livreur, livreur_id)
            if existing:
                existing.geo_lat = lat
                existing.geo_lng = lng
            else:
                db.add(Livreur(id_livreur=livreur_id, geo_lat=lat, geo_lng=lng))
            await db.commit()

        # ─── Order status change ───────────────────────────────────────────
        elif topic == "order.status.updated":
            id_commande = event.get("idCommande")
            new_status  = event.get("statusCommande")
            id_livreur  = event.get("idLivreur")

            order = await db.get(CommandeOpt, id_commande)
            if order:
                order.status = new_status
                if id_livreur:
                    order.id_livreur = id_livreur
                await db.commit()

            # Re-optimize livreur route when delivery is complete
            if new_status == "DELIVERED" and id_livreur:
                await optimize_route_for_livreur(db, id_livreur)