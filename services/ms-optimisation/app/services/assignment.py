"""
Intelligent livreur assignment:
  score = w_dist * (1 - norm_dist) + w_rating * norm_rating

Lower score → better match.
"""
import logging
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.livreur import Livreur
from app.models.commande import CommandeOpt
from app.services.geo import haversine
from app.config.settings import settings

logger = logging.getLogger(__name__)


async def find_best_livreur(
    db: AsyncSession,
    pickup_lat: float,
    pickup_lng: float,
) -> Optional[str]:
    """Return the id of the best available livreur for a given pickup point."""
    result = await db.execute(
        select(Livreur).where(
            Livreur.availability == True,
            Livreur.geo_lat.is_not(None),
        )
    )
    livreurs = result.scalars().all()

    if not livreurs:
        logger.warning("No available livreurs found")
        return None

    # Compute distances
    distances = [
        haversine(lv.geo_lat, lv.geo_lng, pickup_lat, pickup_lng)
        for lv in livreurs
    ]
    ratings = [lv.rating for lv in livreurs]

    max_dist   = max(distances) or 1.0
    max_rating = max(ratings)   or 1.0

    def score(i: int) -> float:
        norm_dist   = distances[i] / max_dist
        norm_rating = ratings[i] / max_rating
        return (
            settings.weight_distance * norm_dist
            - settings.weight_rating * norm_rating   # higher rating → lower (better) score
        )

    best_idx = min(range(len(livreurs)), key=score)
    return livreurs[best_idx].id_livreur


async def auto_assign_order(db: AsyncSession, order: CommandeOpt) -> Optional[str]:
    """Assign an unassigned order to the best available livreur."""
    if not order.pickup_lat or not order.pickup_lng:
        logger.warning("Order %s has no coordinates — cannot assign", order.id_commande)
        return None

    livreur_id = await find_best_livreur(db, order.pickup_lat, order.pickup_lng)
    if livreur_id:
        order.id_livreur = livreur_id
        order.status = "ASSIGNED"
        await db.commit()
        logger.info("Order %s assigned to livreur %s", order.id_commande, livreur_id)
    return livreur_id