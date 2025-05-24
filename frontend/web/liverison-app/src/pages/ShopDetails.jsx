import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoutiqueById,fetchCommandesByBoutiqueId,deleteBoutique } from "../services/boutiqueService";
import { useParams } from 'react-router-dom';
import Wallet from '../assets/Wallet.svg';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop,setshop] = useState({})
  const [orders,setOrders] = useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError] = useState(null)
  // Fake Client Data
  // const shopp = {
  //   id: id,
  //   name: "Dido Shop 34",
  //   email: "dido@gmail.com",
  //   gender: "Male",
  //   registrationDate: "2023-07-15", 
  //   age: 28,
  //   phoneNumber: "+213 665 45 78 90",
  //   address: "Algiers, Algeria",
  //   ownerfirstname: "Dido",
  //   ownerlastname: "ShopOwner",
  //   image: 'https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000'
  // };

  // Fake Orders Data
  // const ordeers = [
  //   { id: 1, price: "$20", items: 3, deliveryname: "John Doe", paymenttype: "Cash", date: "2024-04-01" },
  //   { id: 2, price: "$35", items: 5, deliveryname: "Jane Smith", paymenttype: "Card", date: "2024-04-05" },
  //   { id: 3, price: "$15", items: 2, deliveryname: "Ali Ahmed", paymenttype: "Paypal", date: "2024-04-07" },
  //   { id: 4, price: "$50", items: 7, deliveryname: "Sami Kamel", paymenttype: "Cash", date: "2024-04-10" },
  //   { id: 5, price: "$40", items: 6, deliveryname: "Layla Nassim", paymenttype: "Card", date: "2024-04-12" },
  //   { id: 6, price: "$60", items: 8, deliveryname: "Khaled Omar", paymenttype: "Paypal", date: "2024-04-15" }
  // ];

  useEffect(() => {
      const getBoutiques = async () => {
        try {
          setLoading(true);
          console.log(id)
          const data = await fetchBoutiqueById(id); // your service sends token internally
          const orders = await fetchCommandesByBoutiqueId(id)
          setshop(data);
          console.log("data response:" ,data.boutique)
          setOrders(orders.data)
          console.log(orders) 
          console.log("Array.isArray(ordersResponse):", Array.isArray(orders));
      console.log("Type of orders:", typeof orders);
          console.log("Response data:", data);
        } catch (err) {
          setError("Failed to load boutiques");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      getBoutiques();
    }, []);
    
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    if (indexOfLastOrder < orders.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);  // Navigate back to the previous page
  };
  const [popupdelete,setpopupdelete] = useState(false)
  const handleDelete = async () => {
    try {
      await deleteBoutique(shop?.boutique?._id);
      console.log(shop?.boutique?._id)
      setpopupdelete(false);
      navigate(-1);
      // Optionally refresh the list or remove the deleted item from state
      // fetchBoutiques(); or update local state
    } catch (error) {
      console.error("Failed to delete boutique:", error);
    }
  };
  
  return (
    <div className="flex flex-row justify-center  gap-2">
      <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-md text-white'
        onClick={() => handleBack()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </div>
    
    <div className='w-full h-full flex flex-col gap-3 text-[16px]'>
      <div className='w-full flex flex-row items-stretch gap-3'>
        <div className='bg-gradient-to-r from-[#5CF39C]/70 from-65% to-light w-8/12 flex flex-row items-center gap-6 p-6 rounded-2xl'>
          <div className='flex flex-col items-center gap-2'>
            <img 
              src={shop?.boutique?.photo} 
              alt='userimage'
              className="w-40 h-40 rounded-lg object-cover mb-2"
            />
             <p className="text-lg font-semibold">{shop?.boutique?.nomBoutique}</p> 
            <button className='flex flex-row items-center gap-1 bg-primary py-1 mt-4 px-3 rounded-md text-white'>
              Send Mail
            </button>
          </div>

          <div className='w-0.5 h-52 bg-gray-600'></div>

          <div className='flex flex-grow flex-col gap-2'>
            <div className='flex flex-row gap-10'>
              <div className='flex flex-col items-start'>
                <p>Owner First Name:</p>
                <p className="text-lg font-semibold">{shop?.user?.firstName}</p>
              </div>
              <div className='flex flex-col items-start'>
                <p>Last Name:</p>
                <p className="text-lg font-semibold">{shop?.user?.lastName}</p>
              </div>
            </div>

            <div className='flex flex-col items-start'>
              <p>Phone Number:</p>
               <p className="text-lg font-semibold">{shop?.boutique?.phone?shop.boutique.phone :"don't have"}</p> 
            </div>

            <div className='flex flex-col items-start'>
              <p>Location Address:</p>
             <p className="text-lg font-semibold">{shop?.boutique?.address?.name?shop?.boutique?.address?.name:"don't have"}</p>
            </div>

            <div className='flex flex-col items-start'>
              <p>Registration Date:</p>
              <p className="text-lg font-semibold">{shop.registrationDate? shop.registrationDate:"26-05-2024"}</p>
            </div>

            <div className='w-full flex flex-row gap-2  justify-end pr-10'>
              <button className='bg-light border-[0.4px] border-green-600 flex flex-row items-center text-green-600 gap-1 py-1 px-3 rounded-md'>
                See Files
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </button>
              <button onClick={()=>setpopupdelete(true)} 
              className='bg-red-600 flex flex-row items-center text-white py-1 px-3 rounded-md'>
                Delete
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2 flex-grow'>
          <div className='flex items-center h-1/2 rounded-2xl border-1 justify-evenly border-green-400'>
            <img src={Wallet} alt='Wallet'/>
            <div className='flex flex-col items-center'>
              <p>Total Profit</p>
              <p>25300 DA</p>
            </div>
          </div>
          <div className='flex items-center h-1/2 rounded-2xl border-1 justify-evenly border-green-400 px-3'>
            <img src={Wallet} alt='Wallet'/>
            <div className='flex flex-col items-center'>
              <p>Commandes</p>
              <p>{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

        {popupdelete && (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Close button */}
        <div className="flex justify-end">
          <button onClick={() => setpopupdelete(false)} className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0Z" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-center text-lg text-gray-700">
          Are you sure you want to delete the boutique <span className="font-semibold text-black">"{shop?.boutique?.nomBoutique}"</span>?
        </p>

        {/* Action Buttons */}  
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setpopupdelete(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )}



      <div className='flex flex-grow flex-col items-start px-3 pt-3 pb-5 bg-gradient-to-r from-[#5CF39C]/70 from-85% to-light rounded-2xl'>
        <p className="font-semibold mb-3">Commandes History</p>

        <div className='w-full flex flex-col gap-2'>
          {currentOrders.map((order) => (
            <div key={order.id} className='w-full bg-white flex flex-row justify-between items-center p-3 text-[12px] rounded-lg shadow-sm'>
              <div>
                <p className="font-semibold">Order #{order?.id}</p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className="text-gray-700">{order?.price}</p>
                <span>|</span>
                <p className="text-gray-700">{order?.produits.length} items</p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className="text-gray-700 ">Delivering By: {order?.deliveryname}</p>
                <p className="text-gray-500 ">Payment: {order?.Livraisontype}</p>
              </div>
              <div>
                <p className="text-gray-700 ">{order?.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='w-full flex justify-end gap-2 mt-4'>
          <button 
            onClick={prevPage} 
            className='bg-primary text-white py-1 px-4 rounded-md disabled:bg-gray-400'
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m 0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>

          <button 
            onClick={nextPage} 
            className='bg-primary text-white py-1 px-4 rounded-md disabled:bg-gray-400'
            disabled={indexOfLastOrder >= orders.length}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ShopDetails;
