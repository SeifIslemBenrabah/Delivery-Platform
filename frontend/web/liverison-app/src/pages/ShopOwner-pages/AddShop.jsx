import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { IoPricetagsOutline } from "react-icons/io5";
import { GoLocation } from "react-icons/go";
import { FaRegCircleXmark } from "react-icons/fa6";
localStorage.setItem('token','eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDgyOTY2MTcsImV4cCI6MTc0ODM4MzAxN30.1na26FKNBxpI13NE_l9F4-VPLJc9uPPw0rN0BHJiyJM')
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGluZWlzc2FtIiwiYSI6ImNtOXJpcjJpYjF4NzcybnF1bTRxNDlqOGkifQ.Fyz1JH3Fq-AcFryzEj3uXA";

const AddShop = () => {
  const [shopName, setShopName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [userId, setUserId] = useState(2); // Replace with actual user ID from auth context

  const [selectedLocation, setSelectedLocation] = useState({
    lng: 2.89745,
    lat: 36.4567,
  });

  const mapContainerRef = useRef(null);

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

  const handleSubmit = async () => {
    if (
      !shopName ||
      !locationName ||
      !description ||
      !phone ||
      !imageFile
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id", crypto.randomUUID());
    formData.append("description", description);
    formData.append("nomBoutique", shopName);
    formData.append("address", locationName);
    formData.append("idCommercant", userId);
    formData.append("phone", phone);
    formData.append("file", imageFile);

    try {
      const response = await fetch("http://localhost:5050/boutiques", {
        method: "POST",
        headers: {
        
           Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Boutique added successfully!");
        console.log(result);
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow space-y-5">
      <h1 className="text-2xl font-bold mb-4">Add New Shop</h1>

      {/* Shop Name */}
      <div>
        <label className="block text-gray-700 mb-1">Shop Name</label>
        <div className="relative">
          <IoPricetagsOutline className="absolute left-3 top-2.5 text-gray-600" />
          <input
            type="text"
            className="pl-10 py-2 px-2 border w-full rounded"
            placeholder="Enter shop name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
        </div>
      </div>

      {/* Location Name */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 mb-1">
          <GoLocation /> Location Name
        </label>
        <input
          type="text"
          className="w-full py-2 px-2 border rounded"
          placeholder="Enter location name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-gray-700 mb-2">Upload Shop Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* Map */}
      <div>
        <label className="block text-gray-700 mb-2">Select on Map</label>
        <div
          ref={mapContainerRef}
          className="w-full h-[300px] border rounded"
        ></div>
        {selectedLocation && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {selectedLocation.lat.toFixed(5)},{' '}
            {selectedLocation.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-gray-900 text-white py-2 px-6 rounded hover:bg-gray-800"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddShop;
