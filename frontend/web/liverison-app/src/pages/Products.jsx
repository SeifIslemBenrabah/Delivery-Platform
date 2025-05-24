import React, { useEffect, useState } from 'react';
import { fetchproducs } from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(()=>{
    const getProduct = async () =>{
      try{
        setLoading(true)
        const data = await fetchproducs()
        setProducts(data)
      }catch(err){
        setError("Failed to load boutiques");
          console.error(err);
        } finally {
          setLoading(false);
        }
    }
    getProduct()
  },[])
  return (
    <div className="w-full h-full flex flex-col text-white">

<div className="w-full flex items-center justify-between mb-4 flex-wrap gap-4">
  {/* Title on the left */}
  <p className="text-[24px] font-bold text-black">Product</p>

  {/* Search input on the right */}
  <div className="relative w-full sm:w-1/3 max-w-md">
    <input
      type="text"
      placeholder="Search..."
      className="w-full px-3 py-2 text-gray-500 rounded-lg focus:outline-none focus:ring-1 ring-1 ring-gray-400 focus:ring-primary"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  </div>
</div>



      {/* Product Table */}
      <div className="flex-grow overflow-auto rounded-xl bg-backgroundGray shadow-md">
        <table className="min-w-full text-left text-sm text-gray-300 ">
          <thead className="uppercase text-xs text-gray-400 border-b border-gray-600 ">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Shop</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2 w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-600 text-black">
                  <td className="px-6 py-2">
                    <img
                      src={product.photoProduit|| 'https://via.placeholder.com/40'}
                      alt={product.nomProduit || 'Product'}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{product.nomProduit}</td>
                  <td className="px-4 py-2">{product.idBoutique?.nomBoutique}</td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">{product.date}</td>
                  <td className="px-0 py-2">
                    <button className="text-sm px-3 py-1 bg-primary text-white flex flex-row items-center gap-1 hover:bg-blue-700 rounded-lg">
                    See Details 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
