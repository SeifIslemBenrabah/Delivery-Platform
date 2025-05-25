import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeliveryRequests = () => {
  const navigate = useNavigate();
  const handleMoreInfo = (id) => {
    navigate(`/Admin/client/${id}`); // 3. Navigate to client details page
  };
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      age: 29,
      phone: "123-456-7890",
      email: "emma.johnson@example.com",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Liam Smith",
      age: 34,
      phone: "987-654-3210",
      email: "liam.smith@example.com",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Olivia Brown",
      age: 26,
      phone: "555-123-4567",
      email: "olivia.brown@example.com",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ]);
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="w-full h-full flex flex-col  text-white">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-center gap-2">
          <button
            onClick={() => handleBack()}
            className="text-white bg-black rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <p className="font-bold text-black text-xl"> Shops Requests</p>
        </div>
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
            stroke-width="1.5"
            stroke="currentColor"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      <div className="flex-grow overflow-auto rounded-xl bg-backgroundGray shadow-md mt-4 ">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="uppercase text-xs text-black border-b border-gray-600">
            <tr>
              <th className="px-4 py-2">#NB</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Shop Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="bg-white my-1 text-black">
                  <td className="px-4 py-2">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{client.name}</td>
                  <td className="px-4 py-2">{client.age}</td>
                  <td className="px-4 py-2">{client.phone}</td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleMoreInfo(client.id)}
                      className="text-sm flex items-center gap-1 px-3 py-1 bg-primary hover:bg-green-800 rounded-lg text-white">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Popup Modal */}
        {popup && selectedShop && (
          <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-t-3">
              <div className="flex justify-end">
                <button
                  onClick={() => setPopup(false)}
                  className="text-gray-500 hover:text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-8">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-center  text-xl font-bold text-gray-700 mb-3">
                Boutique Infos
              </p>

              {/* Boutique Owner Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex flex-row items-center gap-3 ">
                  <div>
                    <img
                      src={selectedShop?.boutique?.photo}
                      alt="userimage"
                      className="w-36 h-36 rounded-lg object-cover mb-2"
                    />
                  </div>
                  <div className="flex flex-col text-lg font-semibold">
                    <div className="flex flex-row items-start gap-2">
                      <p>Shop Name:</p>
                      <p>{selectedShop?.boutique?.nomBoutique}</p>
                    </div>
                    <div className="flex flex-row items-start gap-2">
                      <p>Owner First Name:</p>
                      <p>{selectedShop?.user?.firstName}</p>
                    </div>
                    <div className="flex flex- items-start gap-2">
                      <p>Owner Last Name:</p>
                      <p className="text-lg font-semibold">
                        {selectedShop?.user?.lastName}
                      </p>
                    </div>
                    <div className="flex flex- items-start gap-2">
                      <p>Phone Number:</p>
                      <p>
                        {selectedShop?.boutique?.phone
                          ? selectedShop.boutique.phone
                          : "don't have"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row text-lg font-semibold gap-1 items-start">
                  <p>Location Address:</p>
                  <p>
                    {selectedShop?.boutique?.address?.name
                      ? selectedShop.boutique.address.name
                      : "don't have"}
                  </p>
                </div>
                <div className="flex flex-row text-lg font-semibold gap-1 items-start">
                  <p>Email:</p>
                  <p>
                    {selectedShop?.boutique?.address?.name
                      ? selectedShop.user.email
                      : "don't have"}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleUpdate("refuse")}
                  className="bg-red-500 text-white hover:bg-gray-300 text-g px-4 py-2 rounded-md">
                  Refuse
                </button>
                <button
                  onClick={() => handleUpdate("accepte")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRequests;
