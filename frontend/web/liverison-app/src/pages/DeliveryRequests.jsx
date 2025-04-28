import React ,{useState}from 'react';
import { useNavigate } from 'react-router-dom';
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
        image: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        id: 2,
        name: "Liam Smith",
        age: 34,
        phone: "987-654-3210",
        email: "liam.smith@example.com",
        image: "https://randomuser.me/api/portraits/men/2.jpg"
      },
      {
        id: 3,
        name: "Olivia Brown",
        age: 26,
        phone: "555-123-4567",
        email: "olivia.brown@example.com",
        image: "https://randomuser.me/api/portraits/men/3.jpg"
      }
    ])
    const handleBack = () => {
        navigate(`/Admin/deliveries`);
      };
  return (
    <div className="w-full h-full flex flex-col  text-white">
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center justify-center gap-2'>
                <button onClick={() => handleBack()}
                className='text-white bg-black rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
        <p className='font-bold text-black text-xl'> Delivery Requests</p>
        </div>
        <div className="relative w-1/3 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-1 text-gray-500 rounded-lg focus:outline-none focus:ring-1 ring-1 ring-gray-400 focus:ring-primary"
        />
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

      </div>
        </div>
      <div className="flex-grow overflow-auto rounded-xl bg-backgroundGray shadow-md mt-4 ">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="uppercase text-xs text-black border-b border-gray-600">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
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
    </div>
  );
};

export default DeliveryRequests;
