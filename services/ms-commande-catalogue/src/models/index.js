const sequelize = require('../config/database');
const Boutique    = require('./Boutique');
const Catalogue   = require('./Catalogue');
const Produit     = require('./Produit');
const Commande    = require('./Commande');
const CommandeItem = require('./CommandeItem');

// Boutique has many Catalogues
Boutique.hasMany(Catalogue,  { foreignKey: 'idBoutique', as: 'catalogues' });
Catalogue.belongsTo(Boutique, { foreignKey: 'idBoutique', as: 'boutique' });

// Boutique has many Produits
Boutique.hasMany(Produit,  { foreignKey: 'idBoutique', as: 'produits' });
Produit.belongsTo(Boutique, { foreignKey: 'idBoutique', as: 'boutique' });

// Catalogue has many Produits
Catalogue.hasMany(Produit,  { foreignKey: 'idCatalogue', as: 'produits' });
Produit.belongsTo(Catalogue, { foreignKey: 'idCatalogue', as: 'catalogue' });

// Commande has many CommandeItems
Commande.hasMany(CommandeItem,  { foreignKey: 'idCommande', as: 'items', onDelete: 'CASCADE' });
CommandeItem.belongsTo(Commande, { foreignKey: 'idCommande', as: 'commande' });

module.exports = { sequelize, Boutique, Catalogue, Produit, Commande, CommandeItem };