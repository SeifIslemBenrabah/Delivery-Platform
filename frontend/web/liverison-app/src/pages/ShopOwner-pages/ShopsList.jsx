import React, { useContext, useEffect, useRef, useState } from "react";
import shopImg from "../../assets/img/Shop-pic.png";
import ShopCard from "../../Components/ShopCard";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router";
import { FaArrowRight, FaRegCircleXmark } from "react-icons/fa6";
import { IoPricetagsOutline } from "react-icons/io5";
import { SlPicture } from "react-icons/sl";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { IoCalendarClearOutline } from "react-icons/io5";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import InputLabel from "../../Components/InputLabel";
import axios from "axios";
import ShopContext from "../../Context/ShopProvider";
import mapboxgl from "mapbox-gl";

const ShopsList = () => {
  const [search, setSearch] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [shopPicture, setShopPicture] = useState("");
  const [shopPapier, setShopPapier] = useState("");
  const [locationName, setlocationName] = useState("");

  const [workTime, setWorkTime] = useState([]);
  const [openShopForm, setOpenShopForm] = useState(false);
  const [shopFormError, setShopFormError] = useState("");
  // const { setShopAdd } = useContext(ShopContext);
  const [shopsList, setShopsList] = useState([
    // {
    //   name: "Shop Name",
    //   type: "Shop Type",
    //   location: "sidi belabbes, maquoni",
    //   picture: `${shopImg}`,
    // },
  ]);
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZGluZWlzc2FtIiwiYSI6ImNtOXJpcjJpYjF4NzcybnF1bTRxNDlqOGkifQ.Fyz1JH3Fq-AcFryzEj3uXA";

  const [selectedLocation, setSelectedLocation] = useState({
    lng: 2.89745,
    lat: 36.4567,
    name: "Default Location",
  });
  const mapContainerRef = useRef(null);

  // fetching map from mapbox
  useEffect(() => {
    if (!mapContainerRef.current) return;
    console.log(selectedLocation);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [selectedLocation.lng, selectedLocation.lat],
      zoom: 13,
    });

    // Create marker before using it
    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .addTo(map);

    // Click event to move the marker and update state
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      marker.setLngLat([lng, lat]);
      setSelectedLocation({ lng, lat });
    });

    // When marker is dragged, update state
    marker.on("dragend", () => {
      const { lng, lat } = marker.getLngLat(); // destructure correctly
      setSelectedLocation({ lng, lat });
    });
    console.log("Ref:", mapContainerRef.current);

    return () => map.remove();
  }, []);

  useEffect(() => {
    async function fetchShops() {
      try {
        const responce = await axios.get(
          `http://localhost:5050/boutiques/Commercant/${localStorage.getItem(
            "userId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setShopsList(responce?.data);
        localStorage.setItem("shops", JSON.stringify(shopsList));
        console.log(responce?.data);
      } catch (error) {
        if (error.responce.status === 400) {
          console.log("error 400");
        }
      }
    }
    fetchShops();
  }, []);
  // closer shop request pop window fuction
  const closeBtnHandler = () => {
    setOpenShopForm(false);
    setShopName("");
    setShopPicture("");
    setShopType("");
    setShopPapier("");

    setWorkTime("");
  };
  const shopRequestHandler = async () => {
    console.log("this form is working");
    if (
      shopName === "" ||
      shopType === "" ||
      shopPapier === "" ||
      shopPicture === "" ||
      workTime === ""
    ) {
      setShopFormError("You are missing information!");
    } else {
      closeBtnHandler();
    }
  };

  // posting the shop request in the db
  //
  //
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/boutiques",
  //       JSON.stringify({
  //         shopName,
  //         shopType,
  //         shopPicture,
  //         shopPapier,
  //         shopLocation,
  //         workTime,
  //       }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(JSON.stringify(response?.data));
  //     setShopAdd({ shopName, shopType, shopPicture, shopPapier });
  //     setShopName("");
  //     setShopType("");
  //     setShopPicture("");
  //     setShopPapier("");
  //     console.log("the shop is posted");
  //   } catch (error) {
  //     if (!error?.response) {
  //       setShopFormError("no server response");
  //     } else if (error.response?.status === 400) {
  //       setShopFormError("invalid informations you entered");
  //     } else {
  //       setShopFormError("sending request is failed");
  //     }
  //   }
  // };

  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="w-[300px] h-[38px] border border-gray-900 rounded-[8px] flex items-center px-2 focus:border-2 focus:border-gray-950 ">
          <input
            type="search"
            name="product-search"
            id="product-search"
            placeholder="Search for Products"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-full h-full outline-none border-none bg-transparent "
          />
          <FiSearch className="text-xl" />
        </div>

        <button
          onClick={() => {
            setOpenShopForm(true);
          }}
          className="bg-gray-950 text-white text-[16px] w-[160px]  pt-1.5 pb-1.5 rounded flex gap-2.5 justify-center items-center hover:bg-gray-900 cursor-pointer">
          Add Shop
          <AiOutlinePlusCircle className="text-[20px]" />
        </button>
      </div>

      {shopsList.length === 0 ? (
        <div className="w-full grid grid-cols-6 gap-2.5  my-6">
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
                  // onclick={shopProfileHandler}
                  urlProfile={`../shopprofile/${e._id}`}
                />
              );
            })}
        </div>
      ) : (
        <h2 className="text-center w-full text-[20px] text-gray-700 mt-20">
          there is no Shop
        </h2>
      )}

      {/* this is add shop pop up window */}
      {openShopForm && (
        <div className=" fixed inset-0 bg-[#000000a1] flex items-center justify-center gap-2.5 z-10 ">
          <div className="bg-white flex flex-col gap-3 w-[400px] h-[70%]  py-4 px-4 rounded-[16px] ml-48 overflow-auto">
            <div className="flex justify-between mb-2 ">
              <h1 className=" w-full text-center">Add Shop Request</h1>
              <button
                onClick={() => {
                  closeBtnHandler();
                }}
                className="cursor-pointer hover:text-gray-800">
                <FaRegCircleXmark className="text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-gray-500 mb-1.5 ">
                Shop Name
              </label>
              <div className="relative bg-white">
                <IoPricetagsOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="shop name"
                  className="pl-10 py-2 border rounded-md w-full"
                  value={shopName}
                  onChange={(e) => {
                    setShopName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor=""
                className="flex gap-3 items-center  text-gray-500 mb-1.5 ">
                <GoLocation className=" text-gray-600" />
                Shop Location
              </label>
              <input
                type="text"
                placeholder="Enter the location name"
                onChange={(e) => setlocationName(e.target.value)}
                className="w-full py-2 px-2 mb-3 rounded-[8px] border"
              />
              <div
                ref={mapContainerRef}
                className="w-[100%] h-[300px] rounded-[8px] overflow-hidden border"
              />
              {selectedLocation &&
                selectedLocation.lat !== undefined &&
                selectedLocation.lng !== undefined && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedLocation.lat.toFixed(5)},
                    {selectedLocation.lng.toFixed(5)}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-1">
              {/* <label htmlFor="" className="text-gray-500 mb-1.5 ">
                Work Time
              </label>
              <div className="relative bg-white">
                <IoCalendarClearOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="time"
                  placeholder="work time"
                  className="pl-10 py-2 border rounded-md w-full"
                  value={shopName}
                  onChange={(e) => {
                    setShopName(e.target.value);
                  }}
                />
              </div> */}
            </div>
            <div className="flex gap-5 justify-between mt-4 items-center">
              <div className="flex items-center gap-2">
                <SlPicture className="text-2xl" />
                <p className="text-gray-950 font-semibold">Shop Picture :</p>
              </div>
              <label className="w-[32px] h-[32px] bg-green-500 flex justify-center items-center rounded text-white cursor-pointer">
                <input
                  type="file"
                  name="Shop Picture"
                  id=""
                  className="hidden"
                  placeholder=" "
                  value=""
                  onChange={(e) => {
                    setShopPicture(e.target.value);
                  }}
                />
                <BsFileEarmarkPlus className="w-[20px] h-[20px]" />
              </label>
            </div>
            {/* <div className="flex gap-5 justify-between mt-4 items-center">
                <div className="flex items-center gap-2">
                  <SlPicture className="text-2xl" />
                  <p className="text-gray-950 font-semibold">Shop Papier :</p>
                </div>
                <label className="w-[32px] h-[32px] bg-green-500 flex justify-center items-center rounded text-white cursor-pointer">
                  <input
                    type="file"
                    name="Shop Papier"
                    id=""
                    className="hidden"
                    placeholder=" "
                    value=""
                    onChange={(e) => {
                      setShopPapier(e.target.value);
                    }}
                  />
                  <BsFileEarmarkPlus className="w-[20px] h-[20px]" />
                </label>
              </div> */}
            <p className="text-[14px] text-red-500">{shopFormError}</p>
            <button
              onClick={shopRequestHandler}
              className="bg-green-500 w-full text-center text-white text-[16px] py-2 rounded-[6px] cursor-pointer hover:bg-green-400">
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopsList;
