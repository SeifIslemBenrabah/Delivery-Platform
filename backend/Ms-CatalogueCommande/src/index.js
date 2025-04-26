const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const boutiqueRoutes = require("./Routes/boutique.routes");
const productRoutes = require("./Routes/product.routes");
const catalogueRoutes = require("./Routes/Catalogue.routes");
const commandeRoutes = require("./Routes/Commande.routes");
const { Eureka } = require('eureka-js-client');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use("/boutiques", boutiqueRoutes);
app.use("/products", productRoutes);
app.use("/boutiques", catalogueRoutes);
app.use("/commandes", commandeRoutes);

// ✅ DECLARE THE CLIENT GLOBALLY
const client = new Eureka({
  instance: {
    app: 'ms-commande',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': PORT,
      '@enabled': true
    },
    vipAddress: 'ms-commande',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8888,
    servicePath: '/eureka/apps/',
  },
});

connectDB().then(() => {
  console.log("✅ Connected to MongoDB!");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    client.start((error) => {
      if (error) {
        console.error('Eureka registration failed:', error);
      } else {
        console.log('✅ Registered with Eureka!');
      }
    });
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    client.stop(() => {
      console.log('🛑 Eureka client stopped.');
      process.exit();
    });
  });
}).catch((err) => {
  console.error("MongoDB Connection Failed:", err);
  process.exit(1);
});

// ✅ NOW client is accessible here:
module.exports = client;
