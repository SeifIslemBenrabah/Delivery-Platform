import axios from "axios";
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