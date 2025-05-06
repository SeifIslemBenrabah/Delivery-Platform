from fastapi import FastAPI,Request,HTTPException # type: ignore
import random
import sys
from starlette.requests import Request
from starlette.datastructures import Headers
from fastapi.responses import JSONResponse
import requests # type: ignore
import networkx as nx # type: ignore
import py_eureka_client.eureka_client as eureka_client
import math
import numpy as np # type: ignore
import networkx as nx # type: ignore
import time
import folium # type: ignore
from IPython.display import display, IFrame # type: ignore
from itertools import permutations
import os
from geopy.distance import geodesic # type: ignore
from itertools import permutations
from pydantic import BaseModel
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import socket
from contextlib import asynccontextmanager
import logging
from jose import JWTError, jwt


SECRET_KEY = "p7G$z!uKm4W@2r*B9dT&1yNqXlC#vA0e"
ALGORITHM = "HS256"


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# 📌 Fonction de rappel en cas d'erreur
def on_err(err_type: str, err: Exception):
    if err_type in (eureka_client.ERROR_REGISTER, eureka_client.ERROR_DISCOVER):
        eureka_client.stop()
    else:
        print(f"{err_type}::{err}")

MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["Optimization"]
collection = db["livreurs"]

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
            app_name="ms-optimization",                          # Nom du service
            instance_port=instance_port,
            instance_ip=ip,
            health_check_url=f"http://{ip}:8000/health",
            status_page_url=f"http://{ip}:8000/info",
            home_page_url=f"http://{ip}:8000/",
            on_error=on_err
        )
        print("📡 Enregistré dans Eureka comme 'cart-api'")
    except Exception as e:
        print("❌ Erreur lors de l'enregistrement Eureka :", e)

    yield
    # ✅ Attente propre de la méthode async sans bloquer la boucle FastAPI
    '''
    try:
        if hasattr(eureka_client, "stop_async"):
            await eureka_client.stop_async()
            print("🔌 Désenregistré proprement de Eureka (stop_async)")
        elif hasattr(eureka_client, "stop"):
            eureka_client.stop()
            print("🔌 Désenregistré proprement de Eureka (stop)")
        else:
            print("❓ Aucune méthode de désinscription trouvée dans eureka_client")
    except Exception as e:
        print("⚠️ Erreur lors de la désinscription de Eureka :", e)
'''
    print("🛑 Fin du lifespan FastAPI")

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


async def test_connection():
    try:
        # Vérifie si MongoDB est accessible
        await client.admin.command("ping")
        print("✅ Connexion à MongoDB réussie !")

        # Teste l'accès à la base de données "mydb"
        collections = await db.list_collection_names()
        print(f"📂 Collections disponibles dans 'mydb' : {collections}")

    except Exception as e:
        print(f"❌ Erreur de connexion à MongoDB : {e}")


class Livreur(BaseModel):
    id: int
    commandes: List[int]  # Only store IDs
    trajet: List[tuple] = []  # Default t


API_KEY = "sZF4eMOpH75UjsLAcaDX8a6VvmQpEkcdND_b_Tspz7M"

async def getliv(livreur_id: int):
    livreur = await collection.find_one({"id": livreur_id})
    
    if livreur:
        return livreur  # Return existing livreur
    
    # If not found, create a new livreur with default values
    new_livreur = {
        "id": livreur_id,
        "commandes": [],
        "trajet": [],
        "blackList":[]
    }
    
    await collection.insert_one(new_livreur)
    return new_livreur



livreurs=[
        {
            "livreurId": 1,
            "location":(35.20984050039089, -0.6332611355164397),
        },
        {
            "livreurId": 2,
            "location":(35.193810376335115, -0.6330894741016845),
        },
        {
            "livreurId": 3,
            "location":(35.18370280260782, -0.6468599346781924),
        }
    ]

def get_livreur_by_id(id, clusters):
    return next((c for c in clusters if c["idLivreur"] == id), None)

def normalize(x,max):
  if(max==0): return 0
  return x/max

def calculate_time(pos1, pos2):
    time.sleep(1)
    # URL de l'API HERE Routing v8
    url = f"https://router.hereapi.com/v8/routes?transportMode=car&origin={pos1[0]},{pos1[1]}&destination={pos2[0]},{pos2[1]}&return=summary&apikey={API_KEY}"

    # Requête vers l'API
    response = requests.get(url)

    if response.status_code == 200:
     data = response.json()
     summary = data["routes"][0]["sections"][0]["summary"]

     duration_traffic_seconds = summary["duration"]  # Temps avec trafic
     return duration_traffic_seconds

    else:
     print("Erreur:", response.json())

def distance_moy_cmd(clusters, n_depart, n_arrive):
    all_distances = []
    for i, cluster in enumerate(clusters):
        commandes = cluster["Commandes"]
        distances = np.array([
            (calculate_time(n_depart, np.array(cmd["depart"])) +
             calculate_time(np.array(cmd["depart"]), n_depart) +
             calculate_time(np.array(cmd["arrivee"]), n_depart) +
             calculate_time(n_arrive, n_depart) +
             calculate_time(n_arrive, np.array(cmd["arrivee"])) +
             calculate_time(np.array(cmd["arrivee"]), n_arrive))/6
            for cmd in commandes
        ])
        print(distances)
        distances=np.append(distances,np.mean([calculate_time(cluster["position"], n_depart),
                     calculate_time(cluster["position"], n_depart)+
                         calculate_time(n_depart, n_arrive)]))
        print(distances)
        distances = distances if distances.size > 0 else np.array([0])  # Empêche les tableaux vides
        all_distances.append(distances)

    return np.array([np.sum(dist) for dist in all_distances])  # Retourne une liste de moyennes

def predict(nouvelle_commande, clu):
    n_depart = np.array(nouvelle_commande["depart"])
    n_arrive = np.array(nouvelle_commande["arrivee"])

    distances = distance_moy_cmd(clu, n_depart, n_arrive)
    print(distances)
    max_distance = np.max(distances)
    #max_distance_liv = np.max(dist_liv)
    #print(max_distance_liv)
    #max_charge = max(livreur["charge"] for livreur in clu)
    #max_refus = max(livreur["refus"] for livreur in clu)
    print(distances)
    scores = np.zeros(len(clu))  # Initialisation des scores

    for i, cluster in enumerate(clu):
        scores[i] = (
            normalize(distances[i],max_distance)
           # + normalize(cluster["charge"], max_charge)
           # + normalize(cluster["refus"], max_refus)
        )
    print(scores)
    return np.argmin(scores)

def generate_map(data):
  moyenne_lat = np.mean([livreur["position"][0] for livreur in data])
  moyenne_lon = np.mean([livreur["position"][1] for livreur in data])
  carte = folium.Map(location=[moyenne_lat, moyenne_lon], zoom_start=13)

# Ajout des livreurs et commandes
  for livreur in data:
    positions = [livreur["position"]]  # Inclure la position du livreur

    for commande in livreur["Commandes"]:
        positions.append(commande["depart"])
        positions.append(commande["arrivee"])

    # Déterminer le centre du cercle (moyenne des positions)
    center_lat = np.mean([pos[0] for pos in positions])
    center_lon = np.mean([pos[1] for pos in positions])

    # Déterminer le rayon en trouvant la plus grande distance au centre
    max_distance = max([geodesic((center_lat, center_lon), pos).meters for pos in positions])

    # Dessiner un cercle autour de toutes les positions (livreur et commandes)
    folium.Circle(
        location=(center_lat, center_lon),
        radius=max_distance + 100,  # Marge de 100m
        color="blue",
        fill=True,
        fill_color="blue",
        fill_opacity=0.2,
        popup=f"Livreur {livreur['idlivreur']} (rayon: {int(max_distance + 100)}m)"
    ).add_to(carte)

    # Ajouter un marqueur pour le livreur
    folium.Marker(
        location=livreur["position"],
        popup=f"Livreur {livreur['idlivreur']}",
        icon=folium.Icon(color="blue", icon="user")
    ).add_to(carte)

    # Ajouter les commandes
    for commande in livreur["Commandes"]:
        folium.Marker(
            location=commande["depart"],
            popup=f"Départ Commande {commande['idCommande']}",
            icon=folium.Icon(color="green", icon="play")
        ).add_to(carte)

        folium.Marker(
            location=commande["arrivee"],
            popup=f"Arrivée Commande {commande['idCommande']}",
            icon=folium.Icon(color="red", icon="flag")
        ).add_to(carte)

        folium.PolyLine(
            [commande["depart"], commande["arrivee"]],
            color="blue",
            weight=2.5,
            opacity=0.8
        ).add_to(carte)

  # Sauvegarde et affichage de la carte
  map_path = "/livreurs_map.html"
  carte.save(map_path)
  display(IFrame(map_path, width=800, height=500))



def valide_ordre(ordre, commandes_index):
    """
    Vérifie si un ordre de passage est valide (Départ avant Arrivée).
    """
    visites = set()
    for i in ordre:
        if "D" in commandes_index[i]:
            visites.add(commandes_index[i][1:])  # Ajoute l'ID de la commande
        elif "A" in commandes_index[i]:
            id_commande = commandes_index[i][1:]
            if id_commande not in visites:
                return False  # Arrivée avant son départ
    return True

def best_route(livreur):
    """
    Calcule le meilleur trajet pour un livreur en respectant l'ordre Départ -> Arrivée.
    Retourne la liste des positions dans l'ordre optimal.
    """
    # 📍 Création des points (le livreur en premier)
    points = [livreur['position']]
    commandes_index = {0: "Livreur"}
    index = 1

    for c in livreur["Commandes"]:
        commandes_index[index] = f"D{c['idCommande']}"  # Départ
        points.append(c['depart'])
        index += 1
        commandes_index[index] = f"A{c['idCommande']}"  # Arrivée
        points.append(c['arrivee'])
        index += 1

    # 📏 Création du graphe avec distances
    G = nx.complete_graph(len(points))
    for i in range(len(points)):
        for j in range(len(points)):
            if i != j:
                G[i][j]['weight'] = calculate_time(points[i], points[j])

    # ✅ Génération des chemins valides
    indices = list(range(1, len(points)))  # Exclut le livreur (0)
    valid_paths = []

    for perm in permutations(indices):
        chemin = (0,) + perm  # Ajoute la position du livreur au début
        if valide_ordre(chemin, commandes_index):
            valid_paths.append(chemin)

    print(f"\n✅ {len(valid_paths)} chemins valides trouvés.")

    # 🏆 Trouver le chemin le plus court
    if valid_paths:
        best_path = min(valid_paths, key=lambda p: sum(G[p[i]][p[i+1]]['weight'] for i in range(len(p)-1)))

        print("\n🏆 Meilleur chemin trouvé :")
        print(" → ".join([commandes_index[i] for i in best_path]))

        # Convertir indices en positions GPS
        livreur['trajet'] = [points[i] for i in best_path]
    else:
        print("❌ Aucun chemin valide trouvé !")
        livreur['trajet'] = []

    return livreur['trajet']  # Retourne directement les positions GPS


async def update_liv(livreur):
    query_filter = {"id": livreur["idlivreur"]}
    print(livreur["trajet"])

    # 🔹 Extraire seulement les ID des commandes
    commandes_ids = list({c["idCommande"] for c in livreur["Commandes"]})  # Convertir en liste

    update_operation = {
        "$set": {
            "trajet": livreur["trajet"],  # ✅ Correct
            "commandes": commandes_ids  # ✅ Liste des ID seulement
        }
    }

    await collection.update_one(query_filter, update_operation)

async def add_commande_liv(livreur,commande):
    query_filter = {"id": livreur}

    # 🔹 Extraire seulement les ID des commandes

    update_operation = {
        "$push": {
            "commandes": commande  # ✅ Ajouter un ID à la liste
        }
    }

    await collection.update_one(query_filter, update_operation)

async def add_black_list(livreur,commande):
    query_filter = {"id": livreur}

    # 🔹 Extraire seulement les ID des commandes

    update_operation = {
        "$push": {
            "blackList": commande  # ✅ Ajouter un ID à la liste
        }
    }

    await collection.update_one(query_filter, update_operation)    

async def delete_commande_liv(livreur,commande):
    query_filter = {"id": livreur}

    # 🔹 Extraire seulement les ID des commandes

    update_operation = {
        "$pull": {
            "commandes": commande  # ✅ Ajouter un ID à la liste
        }
    }

    await collection.update_one(query_filter, update_operation)


@app.post("/new_order")
async def add_order(request:Request):
    instances = eureka_client.get_client().applications.get_application("MS-GATEWAY").instances
    if not instances:
            return JSONResponse(
                status_code=503,
                content={"message": "MS-GATEWAY service unavailable"}
            )
        
    instance = instances[0]
    print(1)
    url_cmd=f"http://{instance.hostName}:{instance.port.port}/service-commande/commandes"
    url_livreur=f"http://{instance.hostName}:{instance.port.port}/service-suivi/api/livreursLocations"
    response = requests.get(url_cmd)
    print(url_cmd)
    print(response)
    if response.status_code == 200:
      all_commandes = response.json()
      print(all_commandes)
      r=requests.get(url_livreur)
      print(r)
      
      all_livreurs=r.json()['data']
      print(all_livreurs)
      if(not all_livreurs):
          return "no liv"
      
      clusters=await generate_data(all_commandes["commandes"],all_livreurs)
      print(clusters)
      
      order = await request.json()
      print(order)
      
      i=predict(order,clusters)
      print(i)
      
      clusters[i]["Commandes"].append(order)
     # generate_map(clusters)
      trajet=best_route(clusters[i])
      #await update_liv(clusters[i])
      print(trajet)

      post_url = "http://localhost:5010/livreur/route"  # Replace "url.com" with your actual URL
      post_data = {
        "trajet": trajet,
        "livreurId": clusters[i]["idlivreur"],
        "command":order["idCommande"]
      }
    
      try:
        post_response = requests.post(post_url, json=post_data)
        print(f"POST to {post_url} response: {post_response.status_code} - {post_response.text}")
      except Exception as e:
        print(f"Failed to send POST request: {e}")
      return {"trajet": trajet, "livreur": clusters[i]["idlivreur"]}
      
@app.post("/accept")
async def accept(request:Request):
     # generate_map(clusters)
     instances = eureka_client.get_client().applications.get_application("MS-GATEWAY").instances
     if not instances:
            return JSONResponse(
                status_code=503,
                content={"message": "MS-GATEWAY service unavailable"}
            )
        
     instance = instances[0]
     data=await request.json()
     print(data)
     livreur=data['livreur']
     print(livreur)
     commande=data['commande']
     await add_commande_liv(livreur["livreurId"],commande)
     url_cmd=f"http://{instance.hostName}:{instance.port.port}/service-commande/commandes"
     response = requests.get(url_cmd)
     print(url_cmd)
     if response.status_code == 200:
       all_commandes = response.json()
       clusters=await generate_data(commandes=all_commandes["commandes"],livreurs=[livreur])
       print(clusters)
       trajet=best_route(clusters[0])
       await update_liv(clusters[0])   
       post_url = "http://localhost:5010/livreur/route"  # Replace "url.com" with your actual URL
       post_data = {
        "trajet": trajet,
        "livreurId": clusters[0]["idlivreur"],
        "command":commande
       }
    
       try:
        post_response = requests.post(post_url, json=post_data)
        print(f"POST to {post_url} response: {post_response.status_code} - {post_response.text}")
       except Exception as e:
        print(f"Failed to send POST request: {e}")
       return {"trajet": trajet, "livreur": livreur["livreurId"]}
      
@app.post("/finish")
async def finish(request:Request):
     # generate_map(clusters)
     instances = eureka_client.get_client().applications.get_application("MS-GATEWAY").instances
     if not instances:
            return JSONResponse(
                status_code=503,
                content={"message": "MS-GATEWAY service unavailable"}
            )
        
     instance = instances[0]
     data=await request.json()
     print(data)
     livreur=data['livreur']
     print(livreur)
     commande=data['commande']
     await delete_commande_liv(livreur['livreurId'],commande)
     url_cmd=f"http://{instance.hostName}:{instance.port.port}/service-commande/commandes"
     response = requests.get(url_cmd)
     print(url_cmd)
     print(response)
     if response.status_code == 200:
       all_commandes = response.json()
       print(all_commandes)
       clusters=await generate_data(commandes=all_commandes["commandes"],livreurs=[livreur])
       trajet=best_route(clusters[0])
       print("hi") 
       await update_liv(clusters[0])        
       print(trajet) 
       return {"trajet": trajet, "livreur": livreur['livreurId']}
      
@app.post("/refuse")
async def refuse(request:Request):
     # generate_map(clusters)
     
     instances = eureka_client.get_client().applications.get_application("MS-GATEWAY").instances
     if not instances:
            return JSONResponse(
                status_code=503,
                content={"message": "MS-GATEWAY service unavailable"}
            )
        
     instance = instances[0]
     
     data=await request.json()
     print(data)
     livreur=data['livreur']
     print(livreur)
     commande=data['commande']
     url_cmd=f"http://{instance.hostName}:{instance.port.port}/service-commande/commandes/{commande}"
     await add_black_list(livreur['livreurId'],commande)
     response = requests.get(url_cmd)
     print(url_cmd)
     print(response)
     if response.status_code == 200:
      commande = response.json()
      cmd=commande['commande']

      fake_request = Request(
          scope={
              "type": "http",
              "method": "POST",
              "headers": Headers({}).raw,
          },
          receive=lambda: None,
      )
      fake_request._body = {
          "idCommande": cmd["_id"],
          "depart": (cmd["PickUpAddress"]["longitude"], cmd["PickUpAddress"]["latitude"]),
          "arrivee": (cmd["DropOffAddress"]["longitude"], cmd["DropOffAddress"]["latitude"]),
      }
      return await add_order(fake_request)
     
      

@app.get("/route/{id}")
async def get_route(id):
    livreur = await collection.find_one({"id": id})
    print(livreur)
    if livreur is None:
        return {"trajet": [],"commandes":[]}
    return {"trajet": livreur["trajet"],"commandes":livreur["commandes"]}

async def get_commande_liv(id):
    livreur = await collection.find_one({"commandes": id})
    return livreur["id"] if livreur else None

@app.get("/getCommandeLiv/{id}")
async def get_route(id):
    livreur = await get_commande_liv(id)
    print(livreur)
    if livreur is None:
        return {"erreur": "noLiv"}
    return {"livreur":livreur}    
    

@app.get("/")
def read_root():
    asyncio.run(test_connection())

    return {"message": "Hello, FastAPI!"}




'''
[
   {
      id_livreur
      trajet
      commandes:[1,2,3]
   }
   {
      ..
   }
]


dispo_livreurs
[
   {
      id_livreur
      pos()
   }
   {
      ....
   }
]

commandes_encours
[
   
   {
      id
      posd
      posf
   }
]

clusters
[
   {
      idliverur
      pos
      commandes:
      {
         id
         posd
         posf
      }
      trajet
   }
]

livreurs [
{
  "id":1
  "pos":

}

]
 [
        {
            "idLivreur": 1,
            "position":(35.20984050039089, -0.6332611355164397),
            "Commandes": [
            ],
            "charge":1,
            "refus":1,
            "trajet":[]
        },
        {
            "idLivreur": 2,
            "position":(35.193810376335115, -0.6330894741016845),
            "Commandes": [



            ],
            "charge":1,
            "refus":1,
            "trajet":[]
        },
        {
            "idLivreur": 3,
            "position":(35.18370280260782, -0.6468599346781924),
            "Commandes": [

            ],
            "charge":1,
            "refus":1,
            "trajet":[]
        }
    ]
'''
async def generate_data(commandes, livreurs,commandes_encours=None):
    clu = []
    
    for liv in livreurs:
        
        livdb = await getliv(liv["livreurId"])  # Fetch livreur details
        if commandes_encours in livdb['blackList'] and commandes_encours: continue
        # Ensure livdb.commandes is a set for faster lookup
        liv_commandes = set(livdb["commandes"]) if livdb["commandes"] else set()


        temp = {
            "idlivreur": liv["livreurId"],
            "position": liv["location"],
            "Commandes": [],
            "trajet": livdb["trajet"] if "trajet" in livdb else []
        }

        for cmd in commandes:
            if cmd["_id"] in liv_commandes: 
             temp["Commandes"].append({
                "idCommande":cmd["_id"],
                "depart":(cmd["PickUpAddress"]["longitude"],cmd["PickUpAddress"]["latitude"]),
                "arrivee":(cmd["DropOffAddress"]["longitude"],cmd["DropOffAddress"]["latitude"])
             })

        clu.append(temp)

    return clu



      
# update livreur


def generate_table(commandes):
    return [cmd.idCommande for cmd in commandes]
    



    


@app.get("/call-user-service")
async def call_user_service():
    try:
        # Get all registered apps for debugging
        apps = eureka_client.get_client().applications.applications
        print("Available services:", [app.name for app in apps])
        
        instances = eureka_client.get_client().applications.get_application("MS-GATEWAY").instances
        if not instances:
            return JSONResponse(
                status_code=503,
                content={"message": "MS-GATEWAY service unavailable"}
            )
        
        instance = instances[0]
        url = f"http://{instance.hostName}:{instance.port.port}/service-payement/info"
        
        response = requests.get(url, timeout=5)
        return response.json()
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )