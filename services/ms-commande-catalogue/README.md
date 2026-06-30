# ms-commande-catalogue

**Technology:** Spring Boot (Java 17)  
**Database:** MySQL (via Spring Data JPA)  
**Port:** 8081

## Responsibilities
- Boutique management (create, update, delete, list)
- Catalogue (product categories)
- Product management with Cloudinary for photos
- Order creation and status management
- Shopping cart logic
- Order lifecycle: PENDING → CONFIRMED → ASSIGNED → PICKED_UP → IN_DELIVERY → DELIVERED

## Entities
- Boutique: idBoutique, nomBoutique, address, photoFrontBoutique, idCommercant
- Catalogue: idCatalogue, nomCatalogue
- Produit: idProduit, nomProduit, price, description, photoProduit, stock, chargilyId, idCatalogue
- Commande: idCommande, date, pickUpAddress, dropOffAddress, statusCommande, livraisonType, idClient, idLivreur, totalPrice, livraisonPrice
- CommandeItem: idItem, idCommande, idProduit, quantity, price
- Type: typeName, typeValue

## Kafka Topics Published
- `order.created` — triggers optimization service
- `order.status.updated` — notifies tracking service

## Kafka Topics Consumed
- `payment.completed` — marks order as paid

## API Routes
GET    /api/boutiques
POST   /api/boutiques
PUT    /api/boutiques/{id}
DELETE /api/boutiques/{id}
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/orders/mine
GET    /api/orders/available
GET    /api/orders/{id}
POST   /api/orders
PATCH  /api/orders/{id}/status
PATCH  /api/orders/{id}/assign