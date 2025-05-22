require("dotenv").config();
const { ChargilyClient } = require('@chargily/chargily-pay');
const client = new ChargilyClient({
    api_key: process.env.api_key,
    mode: process.env.mode, // Change to 'live' when deploying your application
  });


const createProduct= async(productData)=>{  
      const product =await client.createProduct(productData) 
      return product.id
}  


const createPrice = async(priceData)=>{
    console.log(priceData)
    const newPrice = await client.createPrice({
      amount: priceData.amount > 100 ? priceData.amount : 100,
      currency: 'dzd',
      product_id: priceData.idProduit,
      
    });
   return newPrice.id
}

const createCheckout = async(items,payment_method)=>{
   console.log(items)
    const checkout = await client.createCheckout({
        items,
        success_url: `http://localhost:${process.env.PORT}/success`,
        failure_url:`http://localhost:${process.env.PORT}/failure`,
        
        collect_shipping_address: true,
      });
      return {checkout_url:checkout.checkout_url,id:checkout.id}
}

module.exports={createProduct,createCheckout,createPrice}