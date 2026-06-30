from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config.database import get_db
from app.models.livreur import Livreur
from app.models.commande import CommandeOpt
from app.schemas.route import RouteResponse, AssignRequest
from app.services.optimizer import optimize_route_for_livreur
from app.services.assignment import auto_assign_order
from app.kafka.producer import publish

router = APIRouter(prefix="/api")


@router.get("/route/{livreur_id}", response_model=RouteResponse)
async def get_optimized_route(livreur_id: str, db: AsyncSession = Depends(get_db)):
    """Return the current optimized route for a livreur (recalculates on the fly)."""
    return await optimize_route_for_livreur(db, livreur_id)


@router.post("/assign", response_model=RouteResponse)
async def assign_orders(body: AssignRequest, db: AsyncSession = Depends(get_db)):
    """Manually assign a list of orders to a specific livreur and optimize their route."""
    orders_result = await db.execute(
        select(CommandeOpt).where(CommandeOpt.id_commande.in_(body.order_ids))
    )
    orders = orders_result.scalars().all()

    if not orders:
        raise HTTPException(status_code=404, detail="Aucune commande trouvée")

    for order in orders:
        order.id_livreur = body.livreur_id
        order.status     = "ASSIGNED"
    await db.commit()

    route = await optimize_route_for_livreur(db, body.livreur_id)
    await publish("route.optimized", body.livreur_id, {
        "idLivreur":  body.livreur_id,
        "stops":      [s.model_dump() for s in route.stops],
        "polyline":   route.polyline,
        "distanceKm": route.distance_km,
    })
    return route


@router.get("/livreurs")
async def list_livreurs(db: AsyncSession = Depends(get_db)):
    """List all tracked livreurs and their positions."""
    result = await db.execute(select(Livreur))
    return result.scalars().all()


@router.patch("/livreurs/{livreur_id}/availability")
async def set_availability(
    livreur_id: str,
    body: dict,
    db: AsyncSession = Depends(get_db),
):
    """Toggle a livreur's availability."""
    lv = await db.get(Livreur, livreur_id)
    if not lv:
        raise HTTPException(status_code=404, detail="Livreur introuvable")
    lv.availability = body.get("availability", True)
    await db.commit()
    return {"id_livreur": livreur_id, "availability": lv.availability}