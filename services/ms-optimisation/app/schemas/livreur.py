from pydantic import BaseModel
from typing import Optional


class LivreurPosition(BaseModel):
    id_livreur:   str
    geo_lat:      float
    geo_lng:      float
    availability: Optional[bool] = True
    rating:       Optional[float] = 0.0