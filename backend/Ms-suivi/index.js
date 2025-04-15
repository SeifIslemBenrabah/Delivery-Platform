import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { Commande, Livreur } from "./models/Livreur.js";
import mongoose from "mongoose";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/suivi";

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" Connected to MongoDB");
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1);
    }
}

connectDB();

const app = express();
const PORT = process.env.PORT || 5010;
app.use(express.json());
const server = createServer(app);
const wss = new WebSocketServer({ server });

const users = new Map();     
const commandes = new Map(); 

async function loadCommandes() {
    try {
        const dbCommandes = await Commande.find({});
        dbCommandes.forEach((cmd) => {
            commandes.set(cmd._id.toString(), {
                livreurId: cmd.idLivreur.toString(),
                clientId: cmd.idClient.toString(),
                status: cmd.status,
            });
        });
        console.log(` Loaded ${dbCommandes.length} commandes into memory`);
    } catch (error) {
        console.error(" Error loading commandes from DB:", error);
    }
}

// Load commandes when the server starts
loadCommandes();

/**
 *  Handle incoming WebSocket messages
 */
async function handleMessage(ws, userId, role, message) {
    try {
        const data = JSON.parse(message);

        // Livreur sends location updates
        if (role === "livreur" && data.location) {
            users.get(userId).location = data.location;

            // Update location in MongoDB
            await Livreur.findByIdAndUpdate(
                userId,
                { 
                    location: { type: "Point", coordinates: data.location },
                    lastUpdate: new Date()
                },
                { new: true }
            );

            console.log(`Livreur ${userId} location updated`);

            // Notify clients about their livreur's location
            for (const [cmdId, cmdData] of commandes) {
                if (cmdData.livreurId === userId) {
                    const client = users.get(cmdData.clientId);
                    if (client && client.ws.readyState === client.ws.OPEN) {
                        client.ws.send(
                            JSON.stringify({
                                type: "location_update",
                                livreurId: userId,
                                location: data.location,
                                timestamp: new Date().toISOString(),
                            })
                        );
                    }
                }
            }
        }

        // Client requests a commande's status
        if (role === "client" && data.commandeId) {
            const cmdData = commandes.get(data.commandeId);
            if (cmdData && cmdData.clientId === userId) {
                const livreur = users.get(cmdData.livreurId);
                ws.send(
                    JSON.stringify({
                        type: "commande_status",
                        commandeId: data.commandeId,
                        livreurId: cmdData.livreurId,
                        location: livreur ? livreur.location : null,
                        status: cmdData.status,
                        timestamp: new Date().toISOString(),
                    })
                );
            } else {
                ws.send(
                    JSON.stringify({
                        type: "error",
                        message: "Commande not found or you don't have access",
                    })
                );
            }
        }
    } catch (error) {
        console.error(" Error handling message:", error);
        ws.send(
            JSON.stringify({
                type: "error",
                message: "Invalid message format",
            })
        );
    }
}

/**
 *  When a new livreur connects, fetch and store their commandes in memory
 */
async function handleCommande(userId) {
    try {
        const livreurCommandes = await axios.get(`http://localhost:8000/route/${userId}`);
        for (let com of livreurCommandes.data) {
            const commandeData = await axios.get(`http://localhost:5000/commandes/${com.commandeId}`);

            // Save to MongoDB
            const savedCommande = await Commande.create({
                idClient: new mongoose.Types.ObjectId(commandeData.data.idClient),
                idLivreur: new mongoose.Types.ObjectId(userId),
                dropLocation: { type: "Point", coordinates: commandeData.data.DropOffAddress },
                pickupLocation: { type: "Point", coordinates: commandeData.data.PickUpAddress },
                status: commandeData.data.statusCommande,
            });

            // Save to Map for fast access
            commandes.set(savedCommande._id.toString(), {
                livreurId: userId,
                clientId: commandeData.data.idClient,
                status: commandeData.data.statusCommande,
            });

            console.log("✅ Commande created & stored in memory:", savedCommande);
        }
    } catch (error) {
        console.error(" Error handling commandes:", error);
    }
}

/**
 *  Handle WebSocket Connections
 */
wss.on("connection", (ws, req) => {
    const { query } = parse(req.url, true);
    const userId = query.userId;
    const role = query.role;

    if (!userId || !role) {
        ws.send(JSON.stringify({ type: "error", message: "Missing userId or role" }));
        ws.close();
        return;
    }

    users.set(userId, { ws, role, location: null });

    console.log(`🔵 User ${userId} connected as ${role}. Current users:`, Array.from(users.keys()));

    // If a livreur connects, fetch their commandes
    if (role === "livreur") {
        handleCommande(userId);
    }

    ws.on("message", (message) => handleMessage(ws, userId, role, message));
    ws.on("close", () => {
        users.delete(userId);
        console.log(` User ${userId} disconnected`);
    });
    ws.on("error", (error) => console.error(` WebSocket error for user ${userId}:`, error));
});

/**
 *  REST Endpoints
 */
// Get all livreurs' locations
app.get("/livreursLocations", async (req, res) => {
    try {
        const livreurs = [];
        for (const [userId, user] of users.entries()) {
            if (user.role === "livreur" && user.location) {
                livreurs.push({ livreurId: userId, location: user.location });
            }
        }
        res.json({ status: "success", data: livreurs });
    } catch (error) {
        console.error(" Error fetching locations:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

// Get optimized route using GraphHopper
app.get("/route", async (req, res) => {
    try {
        const { startLat, startLon, endLat, endLon } = req.query;
        const url = `https://graphhopper.com/api/1/route?point=${startLat},${startLon}&point=${endLat},${endLon}&vehicle=car&key=${process.env.GRAPH_HOPPER_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(" Error fetching route:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

server.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
