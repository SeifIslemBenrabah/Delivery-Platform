# ms-paiement

**Technology:** Express.js  
**Database:** MySQL  
**Port:** 3004

## Responsibilities
- Chargily payment gateway integration (DZ online payments)
- Payment initiation and webhook handling
- Automatic invoice PDF generation
- Delivery earnings tracking for livreurs
- Revenue tracking for commerçants
- Payment method management

## Entities
- Payment: paymentId, idCommande, idClient, status, totalAmount, prixLivraison, method, chargilyCheckoutUrl, createdAt
- PaymentMethod: idMethod, nomMethod (CARD, CCP, EDAHABIA)
- Livreur earnings: idLivreur, totalRevenu, revenuRetire (synced from ms-utilisateur)
- Commerçant revenue: idCommercant, revenuTotal

## Chargily Flow
1. POST /api/payment/initiate → create Chargily checkout session
2. Redirect user to Chargily payment page
3. Chargily calls POST /api/payment/webhook on success
4. Webhook updates payment status, publishes `payment.completed` to Kafka
5. ms-commande marks order PAID

## Kafka Topics Published
- `payment.completed` — order is paid, notify ms-commande

## API Routes
POST /api/payment/initiate   — start Chargily payment for an order
POST /api/payment/webhook    — Chargily webhook (public, no auth)
GET  /api/payment/:id        — get payment status
GET  /api/payment/mine       — client's payment history