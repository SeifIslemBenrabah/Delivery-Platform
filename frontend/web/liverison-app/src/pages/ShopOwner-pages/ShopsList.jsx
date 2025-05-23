import React, { useContext, useEffect, useState } from "react";
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

const ShopsList = () => {
  const [search, setSearch] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [shopPicture, setShopPicture] = useState("");
  const [shopPapier, setShopPapier] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [openShopForm, setOpenShopForm] = useState(false);
  const [shopFormError, setShopFormError] = useState("");
  const { setShopAdd } = useContext(ShopContext);
  // const [allShops, setallShops] = useState([]);
  const [shopsList, setShopsList] = useState([
    {
      name: "Shop Name",
      type: "Shop Type",
      location: "sidi belabbes, maquoni",
      picture: `${shopImg}`,
    },
  ]);

  // useEffect(() => {
  //   async function fetchShops() {
  //     try {
  //       const responce = await axios.get("http://localhost:5000/boutiques");
  //       setShopsList(responce.data);
  //       console.log(responce.data);
  //     } catch (error) {
  //       if (error.responce.status === 400) {
  //         console.log("error 400");
  //       }
  //     }
  //   }
  //   fetchShops();
  // }, []);
  // closer shop request pop window fuction
  const closeBtnHandler = () => {
    setOpenShopForm(false);
    setShopName("");
    setShopPicture("");
    setShopType("");
    setShopPapier("");
    setShopLocation("");
    setWorkTime("");
  };
  const shopRequestHandler = async () => {
    console.log("this form is working");
    if (
      shopName === "" ||
      shopType === "" ||
      shopPapier === "" ||
      shopPicture === "" ||
      shopLocation === "" ||
      workTime === ""
    ) {
      setShopFormError("You are missing information!");
    } else {
      closeBtnHandler();
    }

    // posting the shop request in the db
    //
    //
    try {
      const response = await axios.post(
        "http://localhost:5000/boutiques",
        JSON.stringify({
          shopName,
          shopType,
          shopPicture,
          shopPapier,
          shopLocation,
          workTime,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setShopAdd({ shopName, shopType, shopPicture, shopPapier });
      setShopName("");
      setShopType("");
      setShopPicture("");
      setShopPapier("");
      console.log("the shop is posted");
    } catch (error) {
      if (!error?.response) {
        setShopFormError("no server response");
      } else if (error.response?.status === 400) {
        setShopFormError("invalid informations you entered");
      } else {
        setShopFormError("sending request is failed");
      }
    }
  };
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
      <div className="w-full grid-cols-6 gap-2.5  my-6">
        {shopsList.map((e, i) => {
          return (
            <ShopCard
              key={i}
              image={e.picture}
              name={e.name}
              type={e.type}
              location={e.location}
              // onclick={shopProfileHandler}
            />
          );
        })}
      </div>
      {/* this is add shop pop up window */}
      {openShopForm && (
        <div className="fixed inset-0 bg-[#000000a1] flex items-center justify-center gap-2.5 z-10">
          <div className="bg-white flex flex-col gap-3 w-[400px] py-4 px-4 rounded-[16px] ml-48">
            <div className="flex justify-between mb-2">
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
              <label htmlFor="" className="text-gray-500 mb-1.5 ">
                Shop Location
              </label>
              <div className="relative bg-white">
                <GoLocation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="shop location"
                  className="pl-10 py-2 border rounded-md w-full"
                  value={shopName}
                  onChange={(e) => {
                    setShopName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-gray-500 mb-1.5 ">
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
              </div>
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
            <div className="flex gap-5 justify-between mt-4 items-center">
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
            </div>
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
