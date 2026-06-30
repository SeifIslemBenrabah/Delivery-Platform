-- Databases per microservice (each service manages its own schema via ORM)
CREATE DATABASE IF NOT EXISTS dp_users CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS dp_commandes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS dp_optimisation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS dp_paiement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant access
GRANT ALL PRIVILEGES ON dp_users.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON dp_commandes.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON dp_optimisation.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON dp_paiement.* TO 'root'@'%';
FLUSH PRIVILEGES;