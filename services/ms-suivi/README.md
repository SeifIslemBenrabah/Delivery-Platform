# ms-suivi

**Technology:** Express.js + Socket.IO  
**Database:** MongoDB (geospatial index on positions)  
**Port:** 3003

## Responsibilities
- Real-time GPS position broadcasting (WebSocket)
- Interactive map with route polyline (GraphHopper)
- Client notifications (ETA, status changes)
- Position history in MongoDB (2dsphere index)
- Admin live dashboard of all active deliveries

## WebSocket Events
Client → Server:
- `tracking:subscribe { orderId }` — subscribe to an order's tracking
- `tracking:unsubscribe { orderId }` — unsubscribe
- `livreur:position { lat, lng }` — livreur sends location

Server → Client:
- `tracking:position:{orderId} { lat, lng, timestamp }` — live position
- `tracking:status:{orderId} { status }` — order status change

## Entities (MongoDB)
- Position: { idPosition, idLivreur, geoLongitude, geoLatitude, timestamp }
- Livreur: { idLivreur, availability, geoLongitude, geoLatitude }
- Commande: { idCommande, statusCommande, pickupLng, pickupLat, dropoffLng, dropoffLat, tempsLivraison }

## Kafka Topics Consumed
- `order.status.updated` — relay to WebSocket clients
- `route.optimized` — store route for map display

## API Routes
GET /api/tracking/order/{orderId}     — get last position + ETA
GET /api/tracking/livreur/{livreurId} — get livreur live position