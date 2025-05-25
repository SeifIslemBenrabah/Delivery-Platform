import axios from "axios";

const API_URL = "http://localhost:8082/api/v1/auth/users-by-role";
localStorage.setItem("token","eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDgxOTM1NjUsImV4cCI6MTc0ODI3OTk2NX0.wBfkyMwOJBQsHNFj7M9HwRBf-WixbhumonELWXdwOAk")
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
      const res = await axios.get(`http://localhost:8082/api/v1/auth/active/${id}`, {
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