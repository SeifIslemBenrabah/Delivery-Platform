"""
GraphHopper routing: fetch road-distance matrix and route polyline.
Falls back to straight-line (Haversine) when API key is not configured.
"""
import httpx
import logging
from typing import List, Tuple, Optional
from app.config.settings import settings
from app.services.geo import haversine

logger = logging.getLogger(__name__)


async def get_polyline(
    waypoints: List[Tuple[float, float]]
) -> Tuple[List[List[float]], float]:
    """
    Return (polyline_coords, total_distance_km) for an ordered list of (lat, lng).
    Falls back to straight segments if no API key is set.
    """
    if not settings.graphhopper_api_key or len(waypoints) < 2:
        # Straight-line fallback
        distance = sum(
            haversine(waypoints[i][0], waypoints[i][1], waypoints[i+1][0], waypoints[i+1][1])
            for i in range(len(waypoints) - 1)
        )
        return [list(p) for p in waypoints], round(distance, 2)

    points = "&".join(f"point={lat},{lng}" for lat, lng in waypoints)
    url = (
        f"{settings.graphhopper_url}/route"
        f"?{points}&profile=car&locale=fr&calc_points=true"
        f"&key={settings.graphhopper_api_key}"
    )

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        path = data["paths"][0]
        distance_km = path["distance"] / 1000

        # Decode encoded polyline
        encoded = path["points"]
        coords = _decode_polyline(encoded)
        return coords, round(distance_km, 2)

    except Exception as e:
        logger.error("GraphHopper error: %s — using straight-line fallback", e)
        distance = sum(
            haversine(waypoints[i][0], waypoints[i][1], waypoints[i+1][0], waypoints[i+1][1])
            for i in range(len(waypoints) - 1)
        )
        return [list(p) for p in waypoints], round(distance, 2)


def _decode_polyline(encoded: str) -> List[List[float]]:
    """Decode a Google-encoded polyline string into [[lat, lng], ...]."""
    coords, index, lat, lng = [], 0, 0, 0
    while index < len(encoded):
        for is_lng in (False, True):
            shift, result = 0, 0
            while True:
                b = ord(encoded[index]) - 63
                index += 1
                result |= (b & 0x1F) << shift
                shift += 5
                if b < 0x20:
                    break
            delta = ~(result >> 1) if result & 1 else result >> 1
            if is_lng:
                lng += delta
            else:
                lat += delta
        coords.append([lat / 1e5, lng / 1e5])
    return coords