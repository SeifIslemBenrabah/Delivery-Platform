import requests # type: ignore
import numpy as np # type: ignore
import networkx as nx # type: ignore
import time
from motor.motor_asyncio import AsyncIOMotorClient

API_KEY = "sZF4eMOpH75UjsLAcaDX8a6VvmQpEkcdND_b_Tspz7M"

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