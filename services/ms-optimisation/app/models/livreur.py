from sqlalchemy import String, Float, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.config.database import Base


class Livreur(Base):
    __tablename__ = "livreurs"

    id_livreur:  Mapped[str]   = mapped_column(String(36), primary_key=True)
    geo_lat:     Mapped[float] = mapped_column(Float, nullable=True)
    geo_lng:     Mapped[float] = mapped_column(Float, nullable=True)
    availability:Mapped[bool]  = mapped_column(Boolean, default=True)
    rating:      Mapped[float] = mapped_column(Float, default=0.0)
    updated_at:  Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())