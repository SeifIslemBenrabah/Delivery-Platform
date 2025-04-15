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
    const newPrice = await client.createPrice(priceData);
    return newPrice.id
}

const createCheckout = async(items,payment_method)=>{
    const checkout = await client.createCheckout({
        items,
        success_url: 'https://your-website.com/success',
        failure_url: 'https://your-website.com/failure',
        payment_method, 
        collect_shipping_address: true,
      });
      return checkout.checkout_url
}

module.exports={createProduct,createCheckout,createPrice}