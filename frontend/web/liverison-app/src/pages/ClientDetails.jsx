import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Fake Client Data
  const client = {
    id: id,
    name: "Abdelouaheb Benazzi",
    email: "Abdelouahebbenazzi456@gmail.com",
    gender: "Male",
    registrationDate: "2023-07-15",
    age: 28,
    phoneNumber: "+213 665 45 78 90",
    address: "Algiers, Algeria",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  // Fake Orders Data
  const orders = [
    {
      id: 1,
      price: "$20",
      items: 3,
      deliveryname: "John Doe",
      paymenttype: "Cash",
      date: "2024-04-01",
    },
    {
      id: 2,
      price: "$35",
      items: 5,
      deliveryname: "Jane Smith",
      paymenttype: "Card",
      date: "2024-04-05",
    },
    {
      id: 3,
      price: "$15",
      items: 2,
      deliveryname: "Ali Ahmed",
      paymenttype: "Paypal",
      date: "2024-04-07",
    },
    {
      id: 4,
      price: "$50",
      items: 7,
      deliveryname: "Sami Kamel",
      paymenttype: "Cash",
      date: "2024-04-10",
    },
    {
      id: 5,
      price: "$40",
      items: 6,
      deliveryname: "Layla Nassim",
      paymenttype: "Card",
      date: "2024-04-12",
    },
    {
      id: 6,
      price: "$60",
      items: 8,
      deliveryname: "Khaled Omar",
      paymenttype: "Paypal",
      date: "2024-04-15",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  // Calculate indexes
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
    navigate(`/Admin/clients`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 text-[16px]">
      <div
        className="bg-primary flex items-center justify-center rounded-2xl text-white"
        onClick={() => handleBack()}>
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
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </div>
      <div className="bg-gradient-to-r from-[#5CF39C]/70 from-85% to-light w-full min-h-3/6 flex flex-row items-center gap-6 p-6 rounded-2xl">
        <div className="flex flex-col items-center gap-2">
          <img
            src={client.image}
            alt="userimage"
            className="w-40 h-40 rounded-lg object-cover mb-2"
          />
          <p className="text-lg font-semibold">{client.name}</p>
          <p>{client.email}</p>
          <button className="flex flex-row items-center gap-1 bg-primary py-1 px-3 rounded-md text-white mt-2">
            Send Mail
          </button>
        </div>

        <div className="w-0.5 h-52 bg-gray-600"></div>

        <div className="flex flex-grow flex-col gap-4">
          <div className="flex flex-row gap-10">
            <div className="flex flex-col items-start">
              <p>Gender</p>
              <p className="text-lg font-semibold">{client.gender}</p>
            </div>
            <div className="flex flex-col items-start">
              <p>Registration Date</p>
              <p className="text-lg font-semibold">{client.registrationDate}</p>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <p>Age</p>
            <p className="text-lg font-semibold">{client.age}</p>
          </div>

          <div className="flex flex-col items-start">
            <p>Phone Number</p>
            <p className="text-lg font-semibold">{client.phoneNumber}</p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <p>Location Address:</p>
            <p className="text-lg font-semibold">{client.address}</p>
          </div>

          <div className="w-full flex justify-end pr-10">
            <button className="bg-red-600 flex flex-row items-center text-white py-1 px-3 rounded-md">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="flex flex-grow flex-col items-start px-3 pt-3 pb-5 bg-gradient-to-r from-[#5CF39C]/70 from-85% to-light rounded-2xl">
        <p className="font-semibold mb-3">Commandes History</p>

        <div className="w-full flex flex-col gap-2">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="w-full bg-white flex flex-row justify-between items-center p-3 text-[12px] rounded-lg shadow-sm">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-gray-700">{order.price}</p>
                <span>|</span>
                <p className="text-gray-700">{order.items} items</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-gray-700 ">
                  Delivering By: {order.deliveryname}
                </p>
                <p className="text-gray-500 ">Payment: {order.paymenttype}</p>
              </div>
              <div>
                <p className="text-gray-700 ">{order.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="w-full flex justify-end gap-2 mt-4">
          <button
            onClick={prevPage}
            className="bg-primary text-white py-1 px-4 rounded-md disabled:bg-gray-400"
            disabled={currentPage === 1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          <button
            onClick={nextPage}
            className="bg-primary text-white py-1 px-4 rounded-md disabled:bg-gray-400"
            disabled={indexOfLastOrder >= orders.length}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
