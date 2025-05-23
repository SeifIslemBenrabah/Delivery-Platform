import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { Livreur } from "./models/Livreur.js";
import { Commande } from "./models/Commande.js";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import {client} from "./config/eureka-client.js"
import { verifyToken,auth } from './config/auth.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5010;
app.use(express.json());
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Connect to MongoDB
connectDB();

const users = new Map();      // Stores all connected users (both clients and livreurs)
const livreurs = new Map();   // Stores livreurs and their associated commandes
const commandes = new Map();  // Stores all commandes in memory
const clients = new Map();    // Stores clients and their associated commandes

/**
 * Handle incoming WebSocket messages
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
        console.error("Error handling message:", error);
        ws.send(
            JSON.stringify({
                type: "error",
                message: "Invalid message format",
            })
        );
    }
}

/**
 * Handle WebSocket Connections
 */
wss.on("connection", async(ws, req) => {
    const { query } = parse(req.url, true);
    const userId = query.userId;
    const token = query.token;
    const role = query.role;
    if (!token) {
        ws.send(JSON.stringify({ type: 'error', message: 'Missing token' }));
        ws.close();
        console.log("Missing token");
        return;
      }
      const data = await verifyToken(token);
      console.log(data)
      if (!data || !data.valid) {
        console.log('Unauthorized: Invalid token or verification failed');
        ws.close(); 
        console.log('errorrrrrrrrrr')
        return;
      }
    if (!userId || !role) {
        ws.send(JSON.stringify({ type: "error", message: "Missing userId or role" }));
        ws.close();
        console.log("missing userid or role")
        return;
    }
    if (!data.roles || !data.roles.includes(role)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized role' }));
        ws.close();
        console.log("Unauthorized role")
        return;
      }
    users.set(userId, { ws, role, location: null });
    console.log(`🔵 User ${userId} connected as ${role}. Current users:`, Array.from(users.keys()));

    // If a livreur connects, fetch their commandes
    if (role === "LIVREUR") {
        fetchLivreurCommandes(userId);
    }
    
    // If a client connects, fetch their commandes
    if (role === "CLIENT") {
        fetchClientCommandes(userId);
    }

    ws.on("message", (message) => handleMessage(ws, userId, role, message));
    ws.on("close", () => {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
    });
    ws.on("error", (error) => console.error(`WebSocket error for user ${userId}:`, error));
});


async function fetchLivreurCommandes(userId) {
    try {
        const response = await axios.get(`http://localhost:8000/route/${userId}`);
        const livreurCommandes = response.data.commandes; 
        for (let com of livreurCommandes) {
            const commandeResponse = await axios.get(`http://localhost:5000/commandes/${com}`);
            const commandeData = commandeResponse.data;
            
            const savedCommande = await Commande.create({
                idClient: new mongoose.Types.ObjectId(commandeData.idClient),
                idLivreur: new mongoose.Types.ObjectId(userId),
                dropLocation: { 
                    type: "Point", 
                    coordinates: [
                        commandeData.DropOffAddress.longitude, 
                        commandeData.DropOffAddress.latitude
                    ] 
                },
                pickupLocation: { 
                    type: "Point", 
                    coordinates: [
                        commandeData.PickUpAddress.longitude, 
                        commandeData.PickUpAddress.latitude
                    ] 
                },
                status: commandeData.statusCommande,
            });

            // Save to Map for fast access
            commandes.set(savedCommande._id.toString(), {
                livreurId: userId,
                clientId: commandeData.idClient,
                status: commandeData.statusCommande,
            });
            
            // Update livreurs map
            if (!livreurs.has(userId)) {
                livreurs.set(userId, []);
            }
            livreurs.get(userId).push(savedCommande._id.toString());
            
            console.log("✅ Commande created & stored in memory:", savedCommande);
        }
    } catch (error) {
        console.error("Error handling commandes:", error);
    }
}
app.post("/notify-livreur",auth(), async (req, res) => {
    try {
        const { idLivreur, idCommande, message } = req.body;

        if (!idLivreur || !idCommande) {
            return res.status(400).json({ error: "idLivreur and idCommande are required" });
        }

        const user = users.get(idLivreur);

        if (!user || user.role !== "livreur") {
            return res.status(404).json({ error: "Livreur not connected" });
        }

        if (user.ws.readyState === user.ws.OPEN) {
            user.ws.send(JSON.stringify({
                type: "new_commande",
                commandeId: idCommande,
                message: message || `Nouvelle commande ${idCommande}` ,
                timestamp: new Date().toISOString(),
            }));
            return res.status(200).json({ success: true, message: "Notification sent to livreur" });
        } else {
            return res.status(500).json({ error: "Livreur WebSocket not open" });
        }
    } catch (error) {
        console.error("Error notifying livreur:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

async function fetchClientCommandes(userId) {
    try {
        const response = await axios.get(`http://localhost:5000/commandes/client/${userId}`);
        const clientCommandes = response.data.map(cmd => ({
            id: cmd._id,
            status: cmd.statusCommande,
            date: cmd.date,
            pickUpCoordinates: [cmd.PickUpAddress.longitude, cmd.PickUpAddress.latitude],
            dropOffCoordinates: [cmd.DropOffAddress.longitude, cmd.DropOffAddress.latitude]
        }));
        
        clients.set(userId, clientCommandes);
        console.log(`Fetched ${clientCommandes.length} commandes for client ${userId}`);
    } catch (error) {
        console.error('Error fetching client commands:', error);
        // If this is called from a WebSocket connection, we should send an error message
        const user = users.get(userId);
        if (user && user.ws.readyState === user.ws.OPEN) {
            user.ws.send(JSON.stringify({
                type: "error",
                message: "Failed to fetch commandes",
                error: error.message
            }));
        }
    }
}

/**
 * REST Endpoints
 */
// Get all livreurs' locations
app.get("/livreursLocations",auth() ,async (req, res) => {
    try {
        const livreursLocations = [];
        for (const [userId, user] of users.entries()) {
            if (user.role === "livreur" && user.location) {
                livreursLocations.push({ livreurId: userId, location: user.location });
            }
        }
        res.json({ status: "success", data: livreursLocations });
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

// Get optimized route using GraphHopper
// app.get("/route", async (req, res) => {
//     try {
//         const { startLat, startLon, endLat, endLon } = req.query;
//         if (!startLat || !startLon || !endLat || !endLon) {
//             return res.status(400).json({ error: "Missing required parameters" });
//         }
        
//         const url = `https://graphhopper.com/api/1/route?point=${startLat},${startLon}&point=${endLat},${endLon}&vehicle=car&key=${process.env.GRAPH_HOPPER_API_KEY}`;
//         const response = await axios.get(url);
//         res.json(response.data);
//     } catch (error) {
//         console.error("Error fetching route:", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

app.get("/route",auth(), async (req, res) => {
    try {
        const { startLat, startLon, endLat, endLon } = req.query;
        if (!startLat || !startLon || !endLat || !endLon) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const url = `https://graphhopper.com/api/1/route?point=${startLat},${startLon}&point=${endLat},${endLon}&vehicle=car&key=${process.env.GRAPH_HOPPER_API_KEY}`;
        const response = await axios.get(url);
        
        const distance = response.data.paths?.[0]?.distance;
        if (distance === undefined) {
            return res.status(500).json({ error: "Could not extract distance from response" });
        }

        res.json({ distance });
    } catch (error) {
        console.error("Error fetching route:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/livreur/route",auth(), async (req, res) => {
    try {
        const body = req.body;
        const { livreurId, trajet, command } = body;

        if (!livreurId || !trajet || !command) {
            return res.status(400).json({ message: "livreurId, trajet and command are required" });
        }
        
        const points = trajet.map(coord => `point=${coord[1]},${coord[0]}`).join('&');

        const url = `https://graphhopper.com/api/1/route?${points}&vehicle=car&locale=en&key=${process.env.GRAPH_HOPPER_API_KEY}&instructions=true`;

        const response = await axios.get(url);
        const routeData = response.data;

        // Check if the livreur is connected
        const user = users.get(livreurId);

        if (!user || user.role !== "livreur") {
            return res.status(404).json({ error: `Livreur not connected ${livreurId}` });
        }

        if (user.ws.readyState === user.ws.OPEN) {
            user.ws.send(JSON.stringify({
                type: "new_route",
                route: routeData,
                command: command
            }));
            console.log(`Route sent to livreur ${livreurId}`);
        } else {
            console.log(`Livreur ${livreurId} WebSocket is not open. Current state: ${user.ws.readyState}`);
            return res.status(500).json({ error: "Livreur WebSocket not open" });
        }

        res.status(200).json({ message: "Route is being sent via WebSocket" });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: "An error occurred while generating route" });
    }
});

  
  

  server.listen(PORT, () => {
    console.log(`ms-suivi running at http://localhost:${PORT}`);
    client.start()
  });