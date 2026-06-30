from sqlalchemy import String, Float, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.config.database import Base


class CommandeOpt(Base):
    """Local snapshot of an order for optimization purposes."""

    __tablename__ = "commandes_opt"

    id_commande:     Mapped[str]   = mapped_column(String(36), primary_key=True)
    id_livreur:      Mapped[str]   = mapped_column(String(36), nullable=True)
    status:          Mapped[str]   = mapped_column(String(32), default="PENDING")
    priorite:        Mapped[int]   = mapped_column(Integer, default=0)
    pickup_address:  Mapped[str]   = mapped_column(String(255), nullable=True)
    dropoff_address: Mapped[str]   = mapped_column(String(255), nullable=True)
    pickup_lat:      Mapped[float] = mapped_column(Float, nullable=True)
    pickup_lng:      Mapped[float] = mapped_column(Float, nullable=True)
    dropoff_lat:     Mapped[float] = mapped_column(Float, nullable=True)
    dropoff_lng:     Mapped[float] = mapped_column(Float, nullable=True)
    created_at:      Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())