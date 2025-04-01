from motor.motor_asyncio import AsyncIOMotorClient
MONGO_URI = "mongodb://admin:secret@localhost:27017/?authSource=admin"
client = AsyncIOMotorClient(MONGO_URI)
db = client["Optimization"]
collection = db["livreurs"]

async def getliv(livreur_id: int):
    livreur = await collection.find_one({"id": livreur_id})
    
    if livreur:
        return livreur  # Return existing livreur
    
    # If not found, create a new livreur with default values
    new_livreur = {
        "id": livreur_id,
        "commandes": [],
        "trajet": []
    }
    
    await collection.insert_one(new_livreur)
    return new_livreur

async def update_liv(livreur):
    query_filter={"idLivreur":livreur.idLivreur}
    update_operation={'$set':[
        {'trajet':livreur.trajet},{'commandes':livreur.commandes}
    ]}
    await collection.update_one(query_filter, update_operation)