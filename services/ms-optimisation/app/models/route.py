from sqlalchemy import String, Float, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.config.database import Base


class RouteOpt(Base):
    """Stores the latest optimized route per livreur."""

    __tablename__ = "routes_opt"

    id_livreur: Mapped[str]  = mapped_column(String(36), primary_key=True)
    stops:      Mapped[dict] = mapped_column(JSON, default=list)
    polyline:   Mapped[dict] = mapped_column(JSON, default=list)
    distance_km:Mapped[float]= mapped_column(Float, default=0.0)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())