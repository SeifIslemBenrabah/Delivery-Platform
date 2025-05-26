import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/img/profile.png";
import { getuserByRole } from "../services/userService";
const Deliveries = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([
    {
      id: 1,
      image:
        "https://th.bing.com/th/id/OIP.eXWcaYbEtO2uuexHM8sAwwHaHa?rs=1&pid=ImgDetMain",
      name: "Seif Benrabah",
      age: 32,
      phone: "+213660987635",
      email: "john@example.com",
    },
    {
      id: 2,
      image:
        "https://th.bing.com/th/id/OIP.eXWcaYbEtO2uuexHM8sAwwHaHa?rs=1&pid=ImgDetMain",
      name: "Islem Benrabah",
      age: 28,
      phone: "+213660987635",
      email: "jane@example.com",
    },
    // Add more clients or leave it empty to test the "no clients" case
  ]);

  const handleMoreInfo = (id) => {
    navigate(`/Admin/deliverie/${id}`);
  };
  const handleDeliveryRequests = () => {
    navigate(`/Admin/DeliveryRequests`);
  };

  useEffect(() => {
    const getClients = async () => {
      try {
        setLoading(true);
        const data = await getuserByRole("LIVREUR");
        const activeUsers = data.filter((user) => user.active === true);
        setClients(activeUsers);
        console.log(data);
      } catch (err) {
        setError("Failed to load Clients");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getClients();
  }, []);
  if (loading) return <div>Loading Clients...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="w-full h-full flex flex-col text-white">
      <div className="w-full flex flex-row justify-between">
        <div className="relative w-1/3 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-1 text-gray-500 rounded-lg focus:outline-none focus:ring-1 ring-1 ring-gray-400 focus:ring-primary"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <button
          onClick={() => handleDeliveryRequests()}
          className="bg-gray-950 flex flex-row text-white items-center px-1.5 rounded-lg gap-2">
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
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          Requests
        </button>
      </div>
      <div className="flex-grow w-full mt-3 rounded-xl pt-4">
        {clients.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No Deliveries found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl ring-1 ring-black p-2 overflow-hidden flex flex-col items-center text-black text-left shadow-lg hover:shadow-xl">
                <img
                  src={client.image ? client.image : profile}
                  alt={client.name}
                  className="w-28 h-28 rounded-lg object-cover mb-4"
                />
                <p className="text-lg font-semibold truncate">
                  {client.firstName + " " + client.lastName}
                </p>
                <p className="text-sm">
                  {client.phone ? client.phone : "0660987635"}
                </p>
                <p className="text-sm">{client.email}</p>
                <button
                  className="mt-3 px-4 py-1 bg-primary text-white flex flex-row items-center gap-1.5 hover:bg-green-700 rounded-lg text-sm"
                  onClick={() => handleMoreInfo(client.id)}>
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
        )}
      </div>
    </div>
  );
};

export default Deliveries;
