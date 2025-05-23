const { Eureka } = require('eureka-js-client');
require("dotenv").config();
const os = require('os');

// Get local IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // fallback
}

const localIp = getLocalIp();
const client = new Eureka({
  instance: {
    app: 'ms-commande', 
    hostName: localIp,
    ipAddr: localIp,
    port: {
      '$': process.env.PORT || 5050,
      '@enabled': true,
    },
    vipAddress: 'ms-commande',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    statusPageUrl: `http://localhost:${process.env.PORT || 5050}/info`,
    healthCheckUrl: `http://localhost:${process.env.PORT || 5050}/health`,
  },
  eureka: {
    host: 'localhost',
    port: 8888,
    servicePath: '/eureka/apps/',
  },
});

function getServiceUrl(serviceName) {
  const instances = client.getInstancesByAppId(serviceName.toUpperCase());
  if (instances && instances.length > 0) {
    const instance = instances[0];
    return `http://${instance.hostName}:${instance.port.$}`;
  }
  throw new Error(`Service ${serviceName} not found`);
}

module.exports = { client, getServiceUrl };
