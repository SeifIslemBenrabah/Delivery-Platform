// src/services/boutiqueService.js
import axios from "axios";

const API_URL = "http://localhost:5050/boutiques";
localStorage.setItem("token","eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDE1OTQsImV4cCI6MTc0ODE4Nzk5NH0.2nBTU0syM2IyK_aC2fbCpbl9WGzk4vtA8IfuccY19wU")
export const fetchBoutiques = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching boutiques:", error);
    throw error;
  }
};
export const fetchBoutiqueById = async (id)=>{
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          return res.data;
        } catch (error) {
          console.error("Error fetching boutiques:", error);
          throw error;
        }
}
export const fetchCommandesByBoutiqueId = async (id)=>{
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5050/commandes/boutique/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          return res.data;
        } catch (error) {
          console.error("Error fetching boutiques:", error);
          throw error;
        }
}
export const deleteBoutique = async (id) =>{
    try{
      const token = localStorage.getItem("token")
      const res = await axios.delete(`${API_URL}/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return res;
    } catch (error) {
      console.error("Error deleting boutique:", error);
      throw error;
    }
  }
  
export const getBoutiquesByStatus = async (status) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`http://localhost:5050/boutiques`, {
      params: { status }, // adds ?status=accepte
      headers: {
        Authorization: `Bearer ${token}`, // auth header if needed
      },
    });

    console.log('Boutiques:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching boutiques:', error);
    throw error;
  }
};


export const updatestatusBoutique = async (id, statusBoutique) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/status/${id}`, 
      { statusBoutique: statusBoutique}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error updating boutique status:", error);
    console.log(`${API_URL}/status/${id}`)
    throw error;
  }
};
