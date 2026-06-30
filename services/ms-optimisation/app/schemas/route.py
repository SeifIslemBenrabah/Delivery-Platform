from pydantic import BaseModel
from typing import List, Optional, Literal


class Stop(BaseModel):
    order_id:  str
    address:   str
    lat:       float
    lng:       float
    type:      Literal["pickup", "delivery"]
    sequence:  int


class RouteResponse(BaseModel):
    id_livreur:  str
    stops:       List[Stop]
    polyline:    List[List[float]]   # [[lat, lng], ...]
    distance_km: float


class AssignRequest(BaseModel):
    livreur_id: str
    order_ids:  List[str]