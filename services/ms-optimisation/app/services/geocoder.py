"""
Geocode street addresses to (lat, lng) using Nominatim (OpenStreetMap).
Results are cached in-process to avoid duplicate requests.
"""
import asyncio
from functools import lru_cache
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)
_geocoder = Nominatim(user_agent="delivery-platform-optimisation")


@lru_cache(maxsize=1024)
def _geocode_sync(address: str) -> Optional[Tuple[float, float]]:
    try:
        location = _geocoder.geocode(address, timeout=5)
        if location:
            return (location.latitude, location.longitude)
    except GeocoderTimedOut:
        logger.warning("Geocoding timeout for: %s", address)
    except Exception as e:
        logger.error("Geocoding error for %s: %s", address, e)
    return None


async def geocode(address: str) -> Optional[Tuple[float, float]]:
    """Non-blocking geocode using thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _geocode_sync, address)