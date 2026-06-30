import json
import logging
from aiokafka import AIOKafkaProducer
from app.config.settings import settings

logger = logging.getLogger(__name__)
_producer: AIOKafkaProducer | None = None


async def start_producer():
    global _producer
    _producer = AIOKafkaProducer(
        bootstrap_servers=settings.kafka_brokers,
        value_serializer=lambda v: json.dumps(v).encode(),
        key_serializer=lambda k: k.encode() if k else None,
    )
    await _producer.start()
    logger.info("[Kafka] Producer started")


async def stop_producer():
    if _producer:
        await _producer.stop()


async def publish(topic: str, key: str, value: dict):
    if not _producer:
        logger.warning("Kafka producer not started — skipping publish to %s", topic)
        return
    try:
        await _producer.send_and_wait(topic, key=key, value=value)
        logger.debug("Published to %s: key=%s", topic, key)
    except Exception as e:
        logger.error("Kafka publish error on %s: %s", topic, e)