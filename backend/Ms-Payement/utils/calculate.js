
const calculateCommercentPrice=(produits)=>{
    let total=0
    for(let p of produits)
    {
        total+=p.quantite*p.price
    }
    return total
}

const calculateLivraisonPrice=()=>{
    return 200
}
module.exports={calculateCommercentPrice,calculateLivraisonPrice}