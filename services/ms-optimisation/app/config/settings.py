from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    port: int = 8000
    db_url: str = "mysql+aiomysql://root:root@localhost:3306/dp_optimisation"
    kafka_brokers: str = "localhost:9092"
    graphhopper_url: str = "https://graphhopper.com/api/1"
    graphhopper_api_key: str = ""
    weight_distance: float = 0.6
    weight_rating: float = 0.4

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()