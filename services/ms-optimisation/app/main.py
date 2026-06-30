import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import init_db
from app.kafka.producer import start_producer, stop_producer
from app.kafka.consumer import start_consumer
from app.routers import optimize

logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(name)s | %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ─── Startup ──────────────────────────────────────────────────────────
    logger.info("Starting ms-optimisation...")
    await init_db()
    logger.info("[DB] Tables ready")
    await start_producer()
    asyncio.create_task(start_consumer())
    logger.info("[Kafka] Consumer task launched")
    yield
    # ─── Shutdown ─────────────────────────────────────────────────────────
    await stop_producer()


app = FastAPI(
    title="ms-optimisation",
    description="TSP-based delivery route optimizer",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(optimize.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ms-optimisation"}