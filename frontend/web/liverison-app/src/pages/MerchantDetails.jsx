import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Wallet from "../assets/Wallet.svg";
import { getuserByID } from "../services/userService";
import {fetchBoutiqueByIdCommarcent} from "../services/boutiqueService";
import profile from "../assets/img/profile.png";
const MerchantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fake Client Data
  // const client = {
  //   id: id,
  //   name: "Abdelouaheb",
  //   lastName: "Benazzi",
  //   email: "Abdelouahebbenazzi456@gmail.com",
  //   gender: "Male",
  //   registrationDate: "2023-07-15",
  //   age: 28,
  //   phoneNumber: "+213 665 45 78 90",
  //   address: "Algiers, Algeria",
  //   shopsNumber: 5,
  //   shopsRequests: 12,
  // };
  const [client, setClient] = useState({});
  useEffect(() => {
    const getuserdetail = async () => {
      try {
        setLoading(true);
        console.log(id);
        const data = await getuserByID(id); // your service sends token internally
        const orders = await fetchBoutiqueByIdCommarcent(id);
        setClient(data);
        // console.log("data response:", data);
        setShops(orders);
        console.log(orders)
        //console.log("Array.isArray(ordersResponse):", Array.isArray(orders));
        console.log("Type of orders:", typeof orders);
        console.log("Response data:", data);
      } catch (err) {
        setError("Failed to load user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getuserdetail();
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fake Shops Data
  const [shops, setShops] = useState([{
    id: 1,
    name: "Green Market",
    address: "Algiers, Algeria",
    opendate: "2023-04-01",
    image:
      "https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000",
  },
  {
    id: 2,
    name: "Tech Store",
    address: "Oran, Algeria",
    opendate: "2023-05-10",
    image:
      "https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000",
  },
  {
    id: 3,
    name: "Fashion Hub",
    address: "Constantine, Algeria",
    opendate: "2023-06-18",
    image:
      "https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000",
  },
  {
    id: 4,
    name: "Home Essentials",
    address: "Annaba, Algeria",
    opendate: "2023-07-25",
    image:
      "https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000",
  },
  {
    id: 5,
    name: "Booky Place",
    address: "Setif, Algeria",
    opendate: "2023-08-02",
    image:
      "https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000",
  },
  {
    id: 6,
    name: "Gadget World",
    address: "Tizi Ouzou, Algeria",
    opendate: "2023-09-15",
    image:
      "https://img.freepik.com/premium-photo/interior-brand-new-fashion-clothing-store_652667-137.jpg?w=2000",
  },]);
  const handleSendMail = () => {
    if (client.email) {
      window.location.href = `mailto:${client.email}`;
    } else {
      alert("Client email not available");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 4;

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = shops.slice(indexOfFirstShop, indexOfLastShop);

  const nextPage = () => {
    if (indexOfLastShop < shops.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBack = () => {
    navigate(`/Admin/merchant`);
  };
  const handleMoreInfo = (id) => {
    navigate(`/Admin/shop/${id}`);
  };
  return (
    <div className="w-full h-full flex flex-col gap-3 text-[16px]">
      <div
        className="bg-primary flex items-center justify-center rounded-2xl text-white cursor-pointer"
        onClick={handleBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </div>

      <div className="w-full flex flex-row items-stretch gap-3">
        <div className="bg-gradient-to-r from-[#5CF39C]/70 from-65% to-light w-8/12 flex flex-col gap-6 p-6 rounded-2xl">
          <p className="text-xl font-bold">Trader Informations Card</p>

          <div className="flex flex-row gap-6">
            <div className="flex flex-col items-start">
              <p>Trader Name:</p>
              <p>{client.firstName}</p>
            </div>
            <div className="flex flex-col items-start">
              <p>Last Name:</p>
              <p>{client.lastName}</p>
            </div>
            <div className="flex flex-col items-start">
              <p>Email:</p>
              <p>{client.email}</p>
            </div>
          </div>

          <div className="flex flex-row gap-6">
            <div className="flex flex-col items-start">
              <p>Shops Number:</p>
              <p>{client.shopsNumber}</p>
            </div>
            <div className="flex flex-col items-start">
              <p>Shops Requests:</p>
              <p>{client.shopsRequests}</p>
            </div>
          </div>

          <div className="flex flex-row gap-6">
            <div className="flex flex-col items-start">
              <p>Phone Number:</p>
              <p>{client.phoneNumber}</p>
            </div>
            <div className="flex flex-col items-start">
              <p>Registration Date: </p>
              <p>{client.registrationDate}</p>
            </div>
          </div>

          <div className="flex flex-row w-full justify-end gap-4">
            <button className="bg-primary text-white py-2 px-4 rounded-lg flex flex-row gap-2">
              Send Mail
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded-lg flex flex-row gap-2">
              Delete
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <div className="flex items-center h-1/2 rounded-2xl border-1 justify-evenly border-green-400">
            <img src={Wallet} alt="Wallet" />
            <div className="flex flex-col items-center">
              <p>Total Profit</p>
              <p>25300 DA</p>
            </div>
          </div>
          <div className="flex items-center h-1/2 rounded-2xl border-1 justify-evenly border-green-400 px-3">
            <img src={Wallet} alt="Wallet" />
            <div className="flex flex-col items-center">
              <p>Total Orders</p>
              <p>{shops.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-grow flex-col items-start px-3 pt-3 pb-5 bg-gradient-to-r from-[#5CF39C]/70 from-85% to-light rounded-2xl">
        <p className="font-semibold mb-3">Shops Owned</p>

        <div className="w-full flex flex-col gap-2">
          {currentShops.map((shop) => (
            <div
              key={shop.id}
              className="w-full bg-white flex flex-row justify-between items-center p-3 text-[12px] rounded-lg shadow-sm">
              <div>
                <img
                  src={shop.photo}
                  alt="shopimg"
                  className="h-11 w-11 rounded-lg"
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-gray-700">{shop?.nomBoutique}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-gray-700">{shop?.address.name ? shop?.address.name : "m'sila"}</p>
              </div>
              <div>
                <p className="text-gray-700">7/7jour</p>
              </div>
              <button
                className="mt-3 px-4 py-1 bg-primary text-white flex flex-row items-center gap-1.5 hover:bg-green-700 rounded-lg text-sm"
                onClick={() => handleMoreInfo(shop._id)}>
                More Infos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-end gap-2 mt-4">
          <button
            onClick={prevPage}
            className="bg-primary text-white py-1 px-4 rounded-md disabled:bg-gray-400"
            disabled={currentPage === 1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          <button
            onClick={nextPage}
            className="bg-primary text-white py-1 px-4 rounded-md disabled:bg-gray-400"
            disabled={indexOfLastShop >= shops.length}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantDetails;
