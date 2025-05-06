const fetch = require('node-fetch');
const {client,getServiceUrl} = require('../config/eureka-client');


const getCommandeProducts = async (idCommande) => {
    try {
        const response = await fetch(`${getServiceUrl('MS-GATEWAY')}/service-commande/commandes/${idCommande}`);
        const commande = await response.json();
        return {products:commande.commande.produits,commande:commande.commande};
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error; // Lance une erreur pour que l'appelant puisse la gérer
    }
};

module.exports = getCommandeProducts;
