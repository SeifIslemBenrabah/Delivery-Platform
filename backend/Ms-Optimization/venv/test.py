from fastapi import FastAPI
from contextlib import asynccontextmanager
import py_eureka_client.eureka_client as eureka_client
import socket
import asyncio
import os
import sys

# Récupère l'adresse IP locale
def get_local_ip():
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except Exception as e:
        print("❌ Erreur lors de la récupération de l'IP :", e)
        return "127.0.0.1"
def get_instance_port():
    # Chercher un argument --port dans sys.argv
    for i, arg in enumerate(sys.argv):
        if arg == '--port' and i+1 < len(sys.argv):
            return int(sys.argv[i+1])
    # Retourner un port par défaut si non spécifié
    return 8000
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Début du lifespan FastAPI")
    ip = get_local_ip()
    instance_port = get_instance_port()
    try:
        # Assurer l'appel de la méthode asynchrone correctement avec await
        await eureka_client.init_async(
            eureka_server="http://127.0.0.1:8888/eureka",  # Ton serveur Eureka
            app_name="cart-api",                          # Nom du service
            instance_port=instance_port,
            instance_ip=ip,
            health_check_url=f"http://{ip}:8000/health",
            status_page_url=f"http://{ip}:8000/info",
            home_page_url=f"http://{ip}:8000/"
        )
        print("📡 Enregistré dans Eureka comme 'cart-api'")
    except Exception as e:
        print("❌ Erreur lors de l'enregistrement Eureka :", e)

    yield
    print("🔌 Déconnexion Eureka (non gérée automatiquement ici)")

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI + Eureka!"}

@app.get("/health")
async def health():
    return {"status": "UP"}

@app.get("/info")
async def info():
    return {"app": "FastAPI Eureka Demo"}
