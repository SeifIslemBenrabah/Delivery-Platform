import axios from "axios";
localStorage.setItem("token","eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDgxOTM1NjUsImV4cCI6MTc0ODI3OTk2NX0.wBfkyMwOJBQsHNFj7M9HwRBf-WixbhumonELWXdwOAk")
export const fetchCommandesByClientId = async (id)=>{
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5050/commandes/client/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          return res.data;
        } catch (error) {
          console.error("Error fetching Commandes:", error);
          throw error;
        }
}