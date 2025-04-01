from calculate import calculate_time
import networkx as nx # type: ignore
from itertools import permutations


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
        livreur['trajet'] = best_path
    else:
        print("❌ Aucun chemin valide trouvé !")