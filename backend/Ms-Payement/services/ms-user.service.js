const fetch = require('node-fetch');
const {client,getServiceUrl} = require('../config/eureka-client');

const verifyToken = async (token) => {
    try {
        console.log("hi")
        console.log(token)
        let url=`${getServiceUrl('MS-GATEWAY')}/service-user/api/v1/auth/verify-token`
        console.log(url)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
        });
        console.log("hi")
        console.log(response.status)
        if (response.status!== 200) {
            return false;
        }
        console.log(response)
        const resp = await response.json();
        console.log(resp)
        return resp.roles; // Assuming the API returns a distance property
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error; // Lance une erreur pour que l'appelant puisse la gérer
    }
};

module.exports = verifyToken;
