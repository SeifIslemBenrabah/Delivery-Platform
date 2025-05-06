const fetch = require('node-fetch');
const {client,getServiceUrl} = require('../config/eureka-client');


const getLivPrice = async (commande) => {
    try {

        console.log(commande)
        let startLat=commande.PickUpAddress.latitude
        let startLong=commande.PickUpAddress.longitude
        let endLat=commande.DropOffAddress.latitude
        let endLong=commande.DropOffAddress.longitude
        const response = await fetch(`${getServiceUrl('MS-GATEWAY')}/service-suivi/api/route?startLat=${startLat}&startLon=${startLong}&endLat=${endLat}&endLon=${endLong}`);
        const resp = await response.json();
        console.log(resp)
        const distance = resp.distance; // Assuming the API returns a distance property
        console.log(distance*0.1)
        return distance * 0.1 > 100 ? Math.round(distance * 0.1) : 100; // Example: 0.1 DZD per km
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error; // Lance une erreur pour que l'appelant puisse la gérer
    }
};

module.exports = getLivPrice;
