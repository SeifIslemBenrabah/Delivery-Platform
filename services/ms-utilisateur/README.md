# ms-utilisateur

**Technology:** Express.js + Node.js  
**Database:** MySQL (via Sequelize ORM)  
**Port:** 3001

## Responsibilities
- JWT authentication (login, register, refresh, logout)
- Role-based access: CLIENT, LIVREUR, COMMERÇANT, ADMIN
- User profile management
- Livreur document verification (cartNationalId, vehiculePapiers)
- Commerçant verification (cartNational, type)
- Token blacklist via Redis
- Profile photo upload to Cloudinary

## Entities
- User (base): userId, firstName, lastName, email, phone, address, password, role, avatar
- Client: idClient → extends User
- Livreur: idLivreur, cartNationalId, vehiculePapiers, availability, rating, totalRevenu, revenuRetire, carteBancaire → extends User
- Commerçant: idCommercant, cartNational, type, carteBancaire, revenuTotal → extends User
- Admin: adminId, adminEmail, password

## Kafka Topics Published
- `user.registered` — when a new user registers
- `user.verified` — when livreur/commerçant is verified by admin

## API Routes
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/livreurs
GET    /api/users/commercants