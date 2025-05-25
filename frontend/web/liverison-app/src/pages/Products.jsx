import React, { useEffect, useState } from 'react';
import { fetchproducs,fetchproductById, updatestatusProduct } from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedproduct, setSelectedproduct] = useState(null);
  const [popup, setPopup] = useState(false);
  const handleUpdate = async (status) => {
    try {
      console.log("Updating status to:", status);
      await updatestatusProduct(selectedproduct._id,status);
      console.log(selectedproduct._id)
      setPopup(false);
    } catch (error) {
      console.error("Failed to update boutique status:", error);
    }
  };
  const handleProductInfos = async (id)=>{
    try{
      const data = await fetchproductById(id)
      setSelectedproduct(data);
      console.log(data)
    }  catch (err) {
      setError("Failed to load boutiques");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  const getProduct = async (selectedStatus) => {
    try {
      setLoading(true);
      const data = await fetchproducs(selectedStatus);
      setProducts(data);
      console.log(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct(status);
  }, [status]);
  const handleProductClick = async (id) => {
    await handleProductInfos(id);
    setPopup(true);
  };
  return (
    <div className="w-full h-full flex flex-col text-white">
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-4">
        <p className="text-[24px] font-bold text-black">Product</p>
        <div className='flex flex-row w-1/2 gap-3'>
          <div className="w-full sm:w-1/2 max-w-xs">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-gray-500 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All</option>
              <option value="accepte">Accepte</option>
              <option value="refuse">Refuse</option>
              <option value="en_attente">En attente</option>
            </select>
          </div>
          <div className="relative w-full sm:w-1/2 max-w-md">
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
                <tr key={product._id} className="border-b border-gray-600 text-black">
                  <td className="px-6 py-2">
                    <img
                      src={product.photoProduit || 'https://via.placeholder.com/40'}
                      alt={product.nomProduit || 'Product'}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{product.nomProduit}</td>
                  <td className="px-4 py-2">{product.idBoutique?.nomBoutique}</td>
                  <td className="px-4 py-2">{product.price}$</td>
                  <td className="px-4 py-2">{product.date}</td>
                  <td className="px-0 py-2">
                    <button 
                    onClick={()=>handleProductClick(product._id)}
                    className="text-sm px-3 py-1 bg-primary text-white flex flex-row items-center gap-1 hover:bg-green-800 rounded-lg">
                      See Details
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {popup && selectedproduct  && (
          <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-t-3">
  <div className="flex justify-end">
    <button onClick={() => setPopup(false)} className="text-gray-500 hover:text-gray-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth="1.5" stroke="currentColor" className="size-8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0Z" />
      </svg>
    </button>
  </div>

  <p className="text-center  text-xl font-bold text-gray-700 mb-3">
   Product Infos
  </p>
  <div className='flex justify-center'>
      <img 
              src={selectedproduct?.photoProduit} 
              alt='userimage'
              className="w-36 h-36 rounded-lg object-cover mb-2"
            />
      </div>
  {/* Boutique Owner Info */}
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex flex-row items-center gap-3 ">
      
    <div className='flex flex-col text-lg font-bold w-full'>
    <div className='flex flex-row items-start gap-2 justify-between w-full'>
        <p>Product Name:</p>
        <p>{selectedproduct?.nomProduit}</p> 
      </div>
      <div className='flex flex-row items-start gap-2 justify-between w-full'>
        <p>Shop Name:</p>
        <p>{selectedproduct?.idBoutique?.nomBoutique
        }</p> 
      </div>
      <div className='flex flex-row items-start gap-2 justify-between w-full'>
        <p>product price:</p>
        <p className="text-lg font-semibold">{selectedproduct?.price} DA</p>
      </div>
      <div className='flex flex-col items-start'>
      <p>Description:</p>
      <p className='font-medium'>
        {selectedproduct?.description ? selectedproduct.description : "don't have"}
      </p>
      </div>
      <div className='flex flex-col items-start'>
      <p>Feateures:</p>
      <p className='font-medium'>
        {selectedproduct?.description ? selectedproduct.description : "don't have"}
      </p>
      </div>
    </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-3 pt-4">
    <button
      onClick={() => handleUpdate('refuse')}
      className="bg-red-500 text-white hover:bg-gray-300 text-g px-4 py-2 rounded-md"
    >
      Refuse
    </button>
    <button
      onClick={() => handleUpdate('accepte')}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
    >
      Accept
    </button>
  </div>
</div>

          </div>
        )}
    </div>
  );
};

export default Products;
