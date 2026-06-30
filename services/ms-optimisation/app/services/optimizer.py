"""
Core optimization pipeline:
  1. Load assigned orders for a livreur
  2. Build stop list: [pickup_A, dropoff_A, pickup_B, dropoff_B, ...]
  3. Build distance matrix (Haversine)
  4. Solve TSP on stop indices
  5. Fetch polyline from GraphHopper (or straight-line fallback)
  6. Return RouteResponse
"""
import logging
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.models.commande import CommandeOpt
from app.models.route import RouteOpt
from app.schemas.route import RouteResponse, Stop
from app.services.geo import build_distance_matrix
from app.services.tsp import solve_tsp
from app.services.graphhopper import get_polyline

logger = logging.getLogger(__name__)


async def optimize_route_for_livreur(
    db: AsyncSession,
    livreur_id: str,
) -> RouteResponse:
    """Build and persist the optimized route for a livreur."""

    # Fetch all ASSIGNED orders for this livreur
    result = await db.execute(
        select(CommandeOpt).where(
            CommandeOpt.id_livreur == livreur_id,
            CommandeOpt.status.in_(["ASSIGNED", "PICKED_UP"]),
        )
    )
    orders: List[CommandeOpt] = result.scalars().all()

    if not orders:
        return RouteResponse(
            id_livreur=livreur_id, stops=[], polyline=[], distance_km=0.0
        )

    # Build flat list of stops: pickup then delivery for each order
    raw_stops = []
    for order in orders:
        if order.pickup_lat and order.pickup_lng:
            raw_stops.append({
                "order_id": order.id_commande,
                "address":  order.pickup_address or "",
                "lat":      order.pickup_lat,
                "lng":      order.pickup_lng,
                "type":     "pickup",
            })
        if order.dropoff_lat and order.dropoff_lng:
            raw_stops.append({
                "order_id": order.id_commande,
                "address":  order.dropoff_address or "",
                "lat":      order.dropoff_lat,
                "lng":      order.dropoff_lng,
                "type":     "delivery",
            })

    if not raw_stops:
        return RouteResponse(
            id_livreur=livreur_id, stops=[], polyline=[], distance_km=0.0
        )

    # Distance matrix on (lat, lng) pairs
    coords = [(s["lat"], s["lng"]) for s in raw_stops]
    dist_matrix = build_distance_matrix(coords)

    # TSP tour
    tour = solve_tsp(dist_matrix)

    # Build ordered Stop list
    ordered_stops = [
        Stop(
            order_id=raw_stops[i]["order_id"],
            address= raw_stops[i]["address"],
            lat=     raw_stops[i]["lat"],
            lng=     raw_stops[i]["lng"],
            type=    raw_stops[i]["type"],
            sequence=seq,
        )
        for seq, i in enumerate(tour)
    ]

    # Road polyline
    waypoints = [(s.lat, s.lng) for s in ordered_stops]
    polyline, distance_km = await get_polyline(waypoints)

    # Persist route
    existing = await db.get(RouteOpt, livreur_id)
    route_data = {
        "stops":       [s.model_dump() for s in ordered_stops],
        "polyline":    polyline,
        "distance_km": distance_km,
    }
    if existing:
        for k, v in route_data.items():
            setattr(existing, k, v)
    else:
        db.add(RouteOpt(id_livreur=livreur_id, **route_data))
    await db.commit()

    logger.info(
        "Route optimized for livreur %s: %d stops, %.1f km",
        livreur_id, len(ordered_stops), distance_km,
    )

    return RouteResponse(
        id_livreur=livreur_id,
        stops=ordered_stops,
        polyline=polyline,
        distance_km=distance_km,
    )