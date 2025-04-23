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
      amount: 100,
      currency: 'dzd',
      product_id: priceData.idProduit,
      
    });
   return newPrice.id
}

const createCheckout = async(items,payment_method)=>{
   console.log(items)
    const checkout = await client.createCheckout({
        items,
        success_url: 'http://localhost:5010/success',
        failure_url: 'http://localhost:5010/failure',
        
        collect_shipping_address: true,
      });
      return checkout.checkout_url
}

module.exports={createProduct,createCheckout,createPrice}