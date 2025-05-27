import React, { useEffect, useRef, useState } from "react";
import shopImg from "../../assets/img/Shop-pic.png";
import ShopCard from "../../Components/ShopCard";
import { FiSearch } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { NavLink, useNavigate } from "react-router-dom";

const ShopsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [shopsList, setShopsList] = useState([]);

  const mapContainerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lng: 2.89745,
    lat: 36.4567,
    name: "Default Location",
  });

  mapboxgl.accessToken =
    "pk.eyJ1IjoiZGluZWlzc2FtIiwiYSI6ImNtOXJpcjJpYjF4NzcybnF1bTRxNDlqOGkifQ.Fyz1JH3Fq-AcFryzEj3uXA";

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [selectedLocation.lng, selectedLocation.lat],
      zoom: 13,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .addTo(map);

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      marker.setLngLat([lng, lat]);
      setSelectedLocation({ lng, lat });
    });

    marker.on("dragend", () => {
      const { lng, lat } = marker.getLngLat();
      setSelectedLocation({ lng, lat });
    });

    return () => map.remove();
  }, []);

  // Fetch shops
  useEffect(() => {
    async function fetchShops() {
      try {
        const response = await axios.get(
          `http://localhost:5050/boutiques/Commercant/${localStorage.getItem("userId")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setShopsList(response?.data);
        localStorage.setItem("shops", JSON.stringify(response?.data));
      } catch (error) {
        if (error.response?.status === 400) {
          console.log("error 400");
        }
      }
    }
    fetchShops();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-[300px] h-[38px] border border-gray-900 rounded-[8px] flex items-center px-2 focus:border-2 focus:border-gray-950">
          <input
            type="search"
            name="product-search"
            id="product-search"
            placeholder="Search for Products"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-full h-full outline-none border-none bg-transparent"
          />
          <FiSearch className="text-xl" />
        </div>

        <NavLink
          to="/shopownerhome/shops/add-shop"
          className="bg-gray-950 text-white text-[16px] w-[160px] pt-1.5 pb-1.5 rounded flex gap-2.5 justify-center items-center hover:bg-gray-900 cursor-pointer"
        >
          Add Shop
          <AiOutlinePlusCircle className="text-[20px]" />
        </NavLink>
      </div>

      {shopsList.length > 0 ? (
        <div className="w-full grid grid-cols-6 gap-2.5 my-6">
          {shopsList
            .filter((shop) => {
              return (
                shop.nomBoutique.toLowerCase().includes(search.toLowerCase()) ||
                shop.address.name.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((e) => {
              return (
                <ShopCard
                  key={e._id}
                  image={e.photo}
                  name={e.nomBoutique}
                  phone={e.phone}
                  location={e.address.name}
                  urlProfile={`../shopprofile/${e._id}`}
                />
              );
            })}
        </div>
      ) : (
        <h2 className="text-center w-full text-[20px] text-gray-700 mt-20">
          There is no Shop
        </h2>
      )}
    </div>
  );
};

export default ShopsList;
