const fetch = require('node-fetch');
const {client,getServiceUrl} = require('../config/eureka-client');

const getCommandeLiv = async (idCommande) => {
    try {
        const response = await fetch(`${getServiceUrl('MS-GATEWAY')}/service-optimization/getCommandeLiv/${idCommande}`);
        const resp = await response.json();
        console.log(resp)
        console.log(resp.livreur)
        return resp.livreur; // Assuming the API returns a distance property
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error; // Lance une erreur pour que l'appelant puisse la gérer
    }
};

module.exports = getCommandeLiv;
