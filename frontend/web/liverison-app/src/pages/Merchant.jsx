import React ,{useEffect, useState}from 'react';
import { useNavigate } from 'react-router-dom';
import { getuserByRole } from '../services/userService';
import profile from "../assets/img/profile.png"
const Merchant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleMoreInfo = (id) => {
    navigate(`/Admin/Merchant/${id}`); // 3. Navigate to client details page
  };
    const [clients, setClients] = useState([
      {
        id: 1,
        name: "Emma Johnson",
        age: 29,
        phone: "123-456-7890",
        email: "emma.johnson@example.com",
        shopnum:2
      },
      {
        id: 2,
        name: "Liam Smith",
        age: 34,
        phone: "987-654-3210",
        email: "liam.smith@example.com",
        shopnum:5
      },
      {
        id: 3,
        name: "Olivia Brown",
        age: 26,
        phone: "555-123-4567",
        email: "olivia.brown@example.com",
        shopnum:1
      }
    ])
    useEffect(()=>{
      const getClients  = async ()=>{
        try {
          setLoading(true);
          const data = await getuserByRole("COMMERCANT");
          const activeUsers = data.filter(user => user.active === true);
        setClients(activeUsers);
          console.log(data)
        } catch (err) {
          setError("Failed to load Clients");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      getClients();
    },[])
    if (loading) return <div>Loading Clients...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    const handleMarchantRequests =()=>{
      navigate(`/Admin/MerchantRequests`)
    }
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
      <button onClick={()=> handleMarchantRequests()}
      className='bg-gray-950 flex flex-row text-white items-center px-1.5 rounded-lg gap-2'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      Requests
      </button>
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
        No Commercant found.
      </td>
    </tr>
  ) : (
    clients.map((client) => (
      <tr key={client.id} className="bg-white my-1 text-black">
        <td className="px-4 py-2">
          <img
            src={client.image?client.image:profile}
            alt={client.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </td>
        <td className="px-4 py-2">{client.firstName+" "+client.lastName}</td>
        <td className="px-4 py-2">{client.age?client.age:"24"}</td>
        <td className="px-4 py-2">{client.phone?client.phone:"0660987635"}</td>
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

export default Merchant;
