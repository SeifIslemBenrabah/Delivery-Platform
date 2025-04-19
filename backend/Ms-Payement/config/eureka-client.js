const Eureka = require('eureka-js-client').Eureka;
require("dotenv").config();
// Configuration du client Eureka
const client = new Eureka({
  instance: {
    app: 'ms-payement', // Nom de votre application (doit correspondre à l'ID dans Eureka)
    hostName: 'localhost', // ou votre hostname/IP publique
    ipAddr: '127.0.0.1',
    port: {
      '$': process.env.PORT, // Port de votre serveur Express
      '@enabled': true,
    },
    vipAddress: 'express-service', // Nom du service (peut être identique à `app`)
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn', // Doit être "MyOwn" pour un déploiement hors AWS
    },
    statusPageUrl: `http://localhost:${process.env.PORT}/info`, // Endpoint de santé (optionnel)
    healthCheckUrl: `http://localhost:${process.env.PORT}/health`, // Endpoint de santé (optionnel)
  },
  eureka: {
    host: 'localhost', // Adresse du serveur Eureka
    port: 8888, // Port par défaut d'Eureka
    servicePath: '/eureka/apps/',
  },
});

module.exports = client;