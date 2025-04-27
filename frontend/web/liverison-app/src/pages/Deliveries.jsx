import React from 'react';
import { useNavigate } from 'react-router-dom';

const Deliveries = () => {
  const navigate = useNavigate();
  const clients = [
    {
      id: 1,
      image: 'https://th.bing.com/th/id/OIP.eXWcaYbEtO2uuexHM8sAwwHaHa?rs=1&pid=ImgDetMain',
      name: 'Seif Benrabah',
      age: 32,
      phone: '+213660987635',
      email: 'john@example.com',
    },
    {
      id: 2,
      image: 'https://th.bing.com/th/id/OIP.eXWcaYbEtO2uuexHM8sAwwHaHa?rs=1&pid=ImgDetMain',
      name: 'Islem Benrabah',
      age: 28,
      phone: '+213660987635',
      email: 'jane@example.com',
    },
    // Add more clients or leave it empty to test the "no clients" case
  ];

  const handleMoreInfo = (id) => {
    navigate(`/client/${id}`);
  };

  return (
    <div className="w-full h-full flex flex-col text-white">
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
      <div className="flex-grow w-full mt-3 rounded-xl pt-4">
        {clients.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No Deliveries found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {clients.map((client) => (
              <div key={client.id} className="rounded-xl ring-1 ring-black p-2 overflow-hidden flex flex-col items-center text-black text-left shadow-lg hover:shadow-xl">
                <img
                  src={client.image}
                  alt={client.name}
                  className="w-28 h-28 rounded-lg object-cover mb-4"
                />
                <p className="text-lg font-semibold truncate">{client.name}</p>
                <p className="text-sm">Age: {client.age}</p>
                <p className="text-sm">{client.phone}</p>
                <button
                  className="mt-3 px-4 py-1 bg-primary text-white flex flex-row items-center gap-1.5 hover:bg-green-700 rounded-lg text-sm"
                  onClick={() => handleMoreInfo(client.id)}
                >
                  More Infos
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
