import axios from "axios";
localStorage.setItem("token","eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJDTElFTlQiXSwic3ViIjoiYWJkb3VAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjgxMTQ0LCJleHAiOjE3NDgzNjc1NDR9.OS0ANQJwYz3JNohS0U5aZvqWJ_CiEqU4bt8r260hmpU")
const API_URL = "http://localhost:8082/api/v1/auth/users-by-role";
export const getuserByRole = async (role) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}`, {
        params: { role }, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Boutiques:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching boutiques:', error);
      throw error;
    }
  };
  export const getuserByID = async (id) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8082/api/v1/auth/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        return res.data;
      } catch (error) {
        console.log("Calling getuserByID with ID:", id);
        console.error("Error fetching user:", error);
        throw error;
      }
  } 
  export  const activeuser = async (id) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:8082/api/v1/auth/active/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        return res.data;
      } catch (error) {
        console.log("Calling getuserByID with ID:", id);
        console.error("Error fetching user:", error);
        throw error;
      }
  }
  export  const refuseDelivery = async (id) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:8082/api/v1/auth/downgrade-from-livreur/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        return res.data;
      } catch (error) {
        console.log("Calling getuserByID with ID:", id);
        console.error("Error fetching user:", error);
        throw error;
      }
  }
  export  const refuseCommarcent = async (id) =>{
    try{
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:8082/api/v1/auth/downgrade-from-commercant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        return res.data;
      } catch (error) {
        console.log("Calling getuserByID with ID:", id);
        console.error("Error fetching user:", error);
        throw error;
      }
  }