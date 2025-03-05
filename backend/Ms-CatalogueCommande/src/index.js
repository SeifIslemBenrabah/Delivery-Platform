const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db"); 
const boutiqueRoutes = require("./Routes/boutique.routes");
const productRoutes = require("./Routes/product.routes")
const catalogueRoutes = require("./Routes/Catalogue.routes")
const commandeRoutes = require("./Routes/Commande.routes")
const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use("/boutiques", boutiqueRoutes);
app.use("/products",productRoutes)
app.use("/boutiques",catalogueRoutes)
app.use("/commandes", commandeRoutes);
connectDB().then(() => {
  console.log(" Connected to MongoDB!");
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("MongoDB Connection Failed:", err);
  process.exit(1); 
});
