const fetch = require('node-fetch');

const getCommandeProducts = async (idCommande) => {
    try {
        const response = await fetch(`http://localhost:5000/commandes/${idCommande}`);
        const commande = await response.json();
        console.log(commande)
        return commande.commande.produits
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error; // Lance une erreur pour que l'appelant puisse la gérer
    }
};

module.exports = getCommandeProducts;
