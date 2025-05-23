import { Eureka } from 'eureka-js-client';
import dotenv from "dotenv";
dotenv.config();
import os from 'os';

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
    app: 'ms-suivi', 
    hostName: localIp,
    ipAddr: localIp,
    port: {
      '$': process.env.PORT || 5010,
      '@enabled': true,
    },
    vipAddress: 'ms-suivi',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    statusPageUrl: `http://localhost:${process.env.PORT || 5010}/info`,
    healthCheckUrl: `http://localhost:${process.env.PORT || 5010}/health`,
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

export  { client, getServiceUrl };
