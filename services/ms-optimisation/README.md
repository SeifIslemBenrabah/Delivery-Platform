# ms-optimisation

**Technology:** FastAPI (Python 3.11)  
**Database:** MySQL (via SQLAlchemy)  
**Port:** 8000

## Responsibilities
- TSP (Travelling Salesman Problem) algorithm for route optimization
- Order clustering by geographic proximity
- Intelligent driver assignment based on proximity + availability + rating
- Optimized itinerary generation with waypoints
- GraphHopper integration for real road distances

## Algorithm
1. Receive new orders (via Kafka `order.created`)
2. Cluster nearby orders (DBSCAN or k-means on GPS coords)
3. Assign cluster to nearest available livreur
4. Run TSP (nearest-neighbor heuristic + 2-opt improvement) on assigned orders
5. Build final route with pickup → delivery pairs
6. Publish optimized route to Kafka `route.optimized`

## Entities
- Livreur: idLivreur, trajet (JSON), geoLat, geoLng, availability
- Commande: idCommande, statusCommande, priorite, pickupLat, pickupLng, dropoffLat, dropoffLng

## Kafka Topics Consumed
- `order.created` — triggers assignment
- `livreur.position` — updates driver location

## Kafka Topics Published
- `route.optimized` — sends optimized route to ms-suivi

## API Routes
GET  /api/route/{livreurId}  — returns optimized stops + polyline
POST /api/assign             — manually assign orders to a livreur