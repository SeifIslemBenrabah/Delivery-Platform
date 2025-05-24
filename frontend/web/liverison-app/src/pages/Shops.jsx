import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  getBoutiquesByStatus } from "../services/boutiqueService";
const Shops = () => {
  const navigate = useNavigate();
  const handleMoreInfo = (id) => {
    navigate(`/Admin/shop/${id}`);
  };
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    // const shops = [
    //     {
    //       id: 1,
    //       image: 'https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000',
    //       name: 'Shop 1',
    //       add:'Al wiam , Sidi belabbes',
    //       phone: '+213660987635',

    //     },
    //     {
    //       id: 2,
    //       image: 'https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000',
    //       name: 'Shop 2',
    //       add:'Al wiam , Sidi belabbes',
    //       phone: '+213660987635'
    //     },
    //     // Add more clients or leave it empty to test the "no clients" case
    //   ];
    useEffect(() => {
      const getBoutiques = async () => {
        try {
          setLoading(true);
          const data = await  getBoutiquesByStatus('accepte'); // your service sends token internally
          setShops(data);
        } catch (err) {
          setError("Failed to load boutiques");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      getBoutiques();
    }, []);
      const handleshopRequests =()=>{
        navigate(`/Admin/ShopRequests`)
      }
      if (loading) return <div>Loading boutiques...</div>;
      if (error) return <div className="text-red-500">{error}</div>;
    
    return (
      <div className="w-full h-full flex flex-col  text-white">
        <div className='w-full flex flex-row justify-between'>
      <div className="relative w-1/3 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-1 text-gray-500 rounded-lg focus:outline-none focus:ring-1 ring-1 ring-gray-400 focus:ring-primary"
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <button onClick={()=> handleshopRequests()}
      className='bg-gray-950 flex flex-row text-white items-center px-1.5 rounded-lg gap-2'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      Requests
      </button>
      </div>
        <div className="flex-grow w-full mt-3 rounded-xl pt-4">
        {shops.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No Deliveries found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="rounded-xl ring-1 ring-black  p-2 overflow-hidden flex flex-col items-center text-black text-left shadow-lg hover:shadow-xl"
              >
                <img
                  src={shop.photo}
                  alt={shop?.nomBoutique}
                  className="w-28 h-28 rounded-lg object-cover mb-3"
                />
                <p className="text-lg font-semibold">{shop?.nomBoutique}</p>
                <p className="text-xs">{shop?.address.name ? shop?.address.name : "m'sila"}</p>
                <p className="text-sm">{shop?.phone ? shop?.phone : "no phone"}</p>
                <button  onClick={() => handleMoreInfo(shop._id)}
                 className="mt-3 px-4 py-1 bg-primary text-white flex flex-row items-center gap-1.5  hover:bg-green-700 rounded-lg text-sm">
                  More Infos
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    );
  };

export default Shops
