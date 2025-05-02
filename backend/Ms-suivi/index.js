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
import { Eureka } from 'eureka-js-client';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5010;
app.use(express.json());
const server = createServer(app);
const wss = new WebSocketServer({ server });

var client = new Eureka({
    instance: {
      app: 'ms-suivi',
      hostName: 'localhost',
      ipAddr: '127.0.0.1',
      port: {
        '$': PORT,
        '@enabled': true,
      },
      vipAddress: 'ms-suivi',
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
  
  server.listen(PORT, () => {
    console.log(`ms-suivi running at http://localhost:${PORT}`);
    client.start((err) => {
      if (err) {
        console.error('ms-suivi failed to register with Eureka:', err);
      } else {
        console.log('ms-suivi registered with Eureka');
      }
    });
  });
// Connect to MongoDB
connectDB();

const users = new Map();      // Stores all connected users (both clients and livreurs)
const livreurs = new Map();   // Stores livreurs and their associated commandes
const commandes = new Map();  // Stores all commandes in memory
const clients = new Map();    // Stores clients and their associated commandes





async function fetchCommands(commands, livreurId) {
    for (const commandId of commands) {
        try {
    //         const instances = client.getInstancesByAppId('MS-GATEWAY'); 
    //          if (!instances || instances.length === 0) {
    //    return res.status(503).json({ message: "commande not available" });
    //         }
    //         const { hostName, port } = instances[0]; 
    //         console.log(port['$'])
    //         let port2=port['$']
    //         const commandeUri = `http://${hostName}:${port2}/service-commande/commandes/`;
    //         console.log(commandeUri)
            const res = await axios.get(`http://localhost:5000/commandes/${commandId}`);
            const commande = res.data.commande;
            const clientId = commande.idClient;
            const dropoff = commande.DropOffAddress;

            commandes.set(commandId, { livreurId, clientId, dropoff_location: dropoff });

            const client = users.get(clientId);
            if (!client || !client.ws) {
                console.error(`WebSocket for client ${clientId} not found`);
                continue;
            }

            const ws = client.ws;

            let livreurData = livreurs.get(livreurId);

            if (!livreurData || !Array.isArray(livreurData.trajet) || livreurData.trajet.length === 0) {
                const response = await axios.get(`http://localhost:8000/route/${livreurId}`);
                const { trajet, commandes: cmds } = response.data;

                if (!trajet || trajet.length === 0) {
                    ws.send(JSON.stringify({ type: "error", message: "No trajet available for this livreur" }));
                    continue;
                }

                livreurData = { trajet, commands: cmds };
                livreurs.set(livreurId, livreurData);
            }

            // Filter trajet up to drop-off location
            let shortenedTrajet = livreurData.trajet;
            if (dropoff && typeof dropoff.longitude === "number" && typeof dropoff.latitude === "number") {
                const dropoffStr = `${dropoff.longitude.toFixed(6)},${dropoff.latitude.toFixed(6)}`;
                const index = livreurData.trajet.findIndex(([lng, lat]) =>
                    `${lng.toFixed(6)},${lat.toFixed(6)}` === dropoffStr
                );

                if (index !== -1) {
                    shortenedTrajet = livreurData.trajet.slice(0, index + 1);
                }
            }

            const points = shortenedTrajet.map(coord => `point=${coord[1]},${coord[0]}`).join('&');
            const url = `https://graphhopper.com/api/1/route?${points}&vehicle=car&locale=en&key=${process.env.GRAPH_HOPPER_API_KEY}&instructions=true`;

            try {
                const graphhopperResponse = await axios.get(url);
                const routeData = graphhopperResponse.data;

                ws.send(JSON.stringify({
                    type: "new_route",
                    route: routeData,
                    command: livreurData.commands
                }));

                console.log(`Shortened route sent to client ${clientId}`);
            } catch (err) {
                console.error("Error fetching route from GraphHopper:", err);
                ws.send(JSON.stringify({ type: "error", message: "Failed to fetch route data" }));
            }

        } catch (error) {
            console.error(`Error fetching command ${commandId}:`, error);
        }
    }
}

/**
 * Handle incoming WebSocket messages
 */
async function handleMessage(ws, userId, role, message) {
    try {
        const data = JSON.parse(message);

        if (role === "livreur" && data.location) {
            let livreurData = livreurs.get(userId);

            if (!livreurData || !Array.isArray(livreurData.trajet) || livreurData.trajet.length === 0) {
                try {
                    const response = await axios.get(`http://localhost:8000/route/${userId}`);
                    const { trajet, commandes } = response.data;

                    if (!trajet || trajet.length === 0) {
                        ws.send(JSON.stringify({ type: "error", message: "No trajet available" }));
                        return;
                    }

                    livreurData = { trajet, commands: commandes };
                    livreurs.set(userId, livreurData);
                } catch (err) {
                    console.error("Error fetching route from backend:", err);
                    ws.send(JSON.stringify({ type: "error", message: "Failed to fetch trajet" }));
                    return;
                }
            }

            // Replace first point in trajet with new location
            livreurData.trajet[0] = data.location;
            livreurs.set(userId, livreurData);

            const points = livreurData.trajet.map(coord => `point=${coord[1]},${coord[0]}`).join('&');
            const url = `https://graphhopper.com/api/1/route?${points}&vehicle=car&locale=en&key=${process.env.GRAPH_HOPPER_API_KEY}&instructions=true`;

            const graphhopperResponse = await axios.get(url);
            const routeData = graphhopperResponse.data;

            const user = users.get(userId);
            if (!user || user.role !== "livreur") {
                ws.send(JSON.stringify({ type: "error", message: `Livreur not connected ${userId}` }));
                return;
            }
            await fetchCommands(livreurData.commands,userId);

            if (user.ws.readyState === user.ws.OPEN) {
                user.ws.send(JSON.stringify({
                    type: "new_route",
                    route: routeData,
                    command: livreurData.commands
                }));
                console.log(`Route sent to livreur ${userId}`);
            } else {
                console.log(`Livreur ${userId} WebSocket is not open. Current state: ${user.ws.readyState}`);
                ws.send(JSON.stringify({ type: "error", message: "Livreur WebSocket not open" }));
            }
            
        }
        if (role === "client" && data.commandId) {
            let command = commandes.get(data.commandId);
        
            if (!command || !command.livreurId || userId !== command.clientId) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid command or livreur not assigned" }));
                return;
            }
        
            let livreurData = livreurs.get(command.livreurId);
        
            if (!livreurData || !Array.isArray(livreurData.trajet) || livreurData.trajet.length === 0) {
                try {
                    const response = await axios.get(`http://localhost:8000/route/${command.livreurId}`);
                    const { trajet, commandes: cmds } = response.data;
        
                    if (!trajet || trajet.length === 0) {
                        ws.send(JSON.stringify({ type: "error", message: "No trajet available for this livreur" }));
                        return;
                    }
        
                    livreurData = { trajet, commands: cmds };
                    livreurs.set(command.livreurId, livreurData);
                } catch (err) {
                    console.error("Error fetching route for livreur from backend:", err);
                    ws.send(JSON.stringify({ type: "error", message: "Failed to fetch livreur route" }));
                    return;
                }
            }
        
            //Filter trajet up to drop-off location only
            let shortenedTrajet = livreurData.trajet;
        
            const dropoff = command.DropOffAddress;
            if (dropoff && typeof dropoff.longitude === "number" && typeof dropoff.latitude === "number") {
                const dropoffStr = `${dropoff.longitude.toFixed(6)},${dropoff.latitude.toFixed(6)}`;
                const index = livreurData.trajet.findIndex(([lng, lat]) =>
                    `${lng.toFixed(6)},${lat.toFixed(6)}` === dropoffStr
                );
        
                if (index !== -1) {
                    shortenedTrajet = livreurData.trajet.slice(0, index + 1);
                }
            }
        
            const points = shortenedTrajet.map(coord => `point=${coord[1]},${coord[0]}`).join('&');
            const url = `https://graphhopper.com/api/1/route?${points}&vehicle=car&locale=en&key=${process.env.GRAPH_HOPPER_API_KEY}&instructions=true`;
        
            try {
                const graphhopperResponse = await axios.get(url);
                const routeData = graphhopperResponse.data;
        
                ws.send(JSON.stringify({
                    type: "new_route",
                    route: routeData,
                    command: livreurData.commands
                }));
        
                console.log(`Shortened route sent to client ${userId}`);
            } catch (err) {
                console.error("Error fetching route from GraphHopper:", err);
                ws.send(JSON.stringify({ type: "error", message: "Failed to fetch route data" }));
            }
        }
        
        
    } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({
            type: "error",
            message: "Invalid message format or internal error"
        }));
    }
}



/**
 * Handle WebSocket Connections
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
    console.log(`User ${userId} connected as ${role}. Current users:`, Array.from(users.keys()));

    // If a livreur connects, fetch their commandes
    if (role === "livreur") {
        
    }
    
    // If a client connects, fetch their commandes
    if (role === "client") {
       
    }

    ws.on("message", (message) => handleMessage(ws, userId, role, message));
    ws.on("close", () => {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
    });
    ws.on("error", (error) => console.error(`WebSocket error for user ${userId}:`, error));
});


app.post("/notify-livreur", async (req, res) => {
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


/**
 * REST Endpoints
 */
// Get all livreurs' locations
app.get("/livreursLocations", async (req, res) => {
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
app.get("/livreurLocation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = users.get(id);

        if (user && user.role === "livreur" && user.location) {
            const data = [{ livreurId: id, location: user.location }];
            res.json({ status: "success", data });
        } else {
            res.status(404).json({ status: "error", message: "Livreur not found or has no location" });
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

app.get("/route", async (req, res) => {
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

app.post("/livreur/route", async (req, res) => {
    try {
        const body = req.body;
        const { livreurId, trajet, commands } = body;
        
        if (!livreurId || !trajet || !commands) {
            return res.status(400).json({ message: "livreurId, trajet and command are required" });
        }
        livreurs.set(livreurId, {
            trajet: trajet,
            commands: commands
          });
        const points = trajet.map(coord => `point=${coord[1]},${coord[0]}`).join('&');

        const url = `https://graphhopper.com/api/1/route?${points}&vehicle=car&locale=en&key=${process.env.GRAPH_HOPPER_API_KEY}&instructions=true`;

        const response = await axios.get(url);
        const routeData = response.data;

        const user = users.get(livreurId);

        if (!user || user.role !== "livreur") {
            return res.status(404).json({ error: `Livreur not connected ${livreurId}` });
        }

        await fetchCommands(commands,livreurId);

        if (user.ws.readyState === user.ws.OPEN) {
            user.ws.send(JSON.stringify({
                type: "new_route",
                route: routeData,
                command: commands
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



  
