import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router";
import { TbSquareArrowLeft } from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaRegCircleXmark } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import shopImg from "../../assets/img/Shop-pic.png";
import StatisticBox from "../../Components/StatisticsBox/StatisticBox";
import CatalogueListItem from "../../Components/CatalogueListItem";
import InputLabel from "../../Components/InputLabel";
import { fetchBoutiqueById } from "../../Services/boutiqueService";
import axios from "axios";
const ShopProfile = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState({});
  const [shopLocation, setShopLocation] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [addCatalogue, setAddCatalogue] = useState(false);
  const [newCatalogue, setNewCatalogue] = useState("");

  const closeBtnHandler = () => {
    setAddCatalogue(false);
    setNewCatalogue("");
  };
  const [catalogueError, setCatalogueError] = useState("");

  useEffect(() => {
    const fetchBoutique = async () => {
      try {
        const data = await fetchBoutiqueById(shopId);
        setShop(data.boutique);
        setShopLocation(data.boutique.address);
        setCatalogues(Array.isArray(data?.catalogues) ? data.catalogues : []);
        // console.log(shop);
        // console.log(data.boutique);
        console.log(shopLocation);
      } catch (error) {
        console.log(error);
      }
    };
    if (shopId) {
      fetchBoutique();
    }
  }, [shopId]);

  const addCatalogueHandler = async () => {
    const res = await axios.post(
      `http://localhost:5050/boutiques/${shopId}/catalogues`
    );
    if (newCatalogue === "") {
      setCatalogueError("the Catalogue name field should be filled");
    } else {
      setCatalogues((prev) => [
        ...prev,
        {
          name: newCatalogue,
          productsNumber: "0 product",
          creationDate: "00-00-0000",
        },
      ]);
      setNewCatalogue("");
      setAddCatalogue(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <div className="text-white w-fit rounded-[8px] bg-green-500 p-1.5 text-2xl cursor-pointer hover:bg-green-400">
          <NavLink to="../shopslist">
            <TbSquareArrowLeft />
          </NavLink>
        </div>
        <div className="flex  gap-4 items-center ">
          <div className="flex  gap-5 h-[350px] bg-gradient-to-tr from-green-500 to-white w-[70%]  rounded-[16px] p-5">
            <div className="flex flex-col gap-3 h-full justify-center items-center">
              <img src={shop.photo} alt="" className="w-[200px] rounded" />
              <h2 className="font-semibold text-2xl">{shop.nomBoutique}</h2>
            </div>
            <div className=" w-[70%] flex flex-col gap-4 p-5 border-l-2 border-gray-900">
              <div className=" w-full  flex  items-center">
                <div className="w-[40%]">
                  <p>Shop Name :</p>
                  <p className="font-semibold">{shop.nomBoutique}</p>
                </div>
                <div>
                  <p>Description :</p>
                  <p className="font-semibold">{shop.description}</p>
                </div>
              </div>
              <div className=" w-full  flex  items-center">
                <div className="w-[40%]">
                  <p className="">Phone Number :</p>
                  <p className="font-semibold">{shop.phone}</p>
                </div>
                <div>
                  <p>catalogue Number :</p>
                  <p className="font-semibold">{catalogues.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <HiLocationMarker />
                  <p>Location Address :</p>
                </div>
                <p className="font-semibold">
                  {shopLocation?.name || "Unknown location"}
                </p>
              </div>
              <div className="flex justify-end w-full gap-4 mt-22">
                {/* here will add the functionality to open pop window  */}
                <button
                  className="flex items-center bg-green-500 rounded px-3 py-1.5 gap-3 text-white cursor-pointer hover:bg-green-400"
                  onClick={() => {
                    setAddCatalogue(true);
                  }}>
                  Add Catalogue
                  <AiOutlinePlusCircle />
                </button>
                <button className="flex items-center bg-red-500 rounded px-3 py-1.5 gap-3 text-white hover:bg-red-400 cursor-pointer">
                  Delete
                  <FaRegCircleXmark />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 justify-center  items-center">
            <StatisticBox
              statisName="Total Profite"
              data="22500 Da"
              picture={shopImg}
            />
            <StatisticBox
              statisName="Total Profite"
              data="22500 Da"
              picture={shopImg}
            />
          </div>
        </div>
        <div className="bg-[#f0f0f0] p-5 h-fit w-[96%] rounded-2xl">
          <h2>Catalogues History</h2>
          <div className="flex flex-col gap-1.5 w-full mt-4">
            {catalogues.map((e, i) => {
              return (
                <CatalogueListItem
                  key={i}
                  catalogeName={e.name}
                  productsNumber={e.productsNumber}
                  creationDate={e.creationDate}
                />
              );
            })}
          </div>
        </div>
      </div>
      {addCatalogue && (
        <div className="fixed inset-0 bg-[#000000a1] flex items-center justify-center gap-2.5 z-10">
          <div className="bg-white flex flex-col gap-3 w-[400px] py-4 px-4 rounded-[16px] ml-48">
            <div className="flex justify-between mb-2">
              <h2>Add Catalogue</h2>
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
                Catalogue Name
              </label>
              <div className="relative bg-white">
                <LuClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="catalogue name"
                  className="pl-10 py-2 border rounded-md w-full"
                  value={newCatalogue}
                  onChange={(e) => {
                    setNewCatalogue(e.target.value);
                  }}
                />
              </div>
            </div>
            <p className=" text-[14px] text-red-500">{catalogueError}</p>
            <button
              onClick={addCatalogueHandler}
              className="bg-green-500 w-full text-center text-white text-[16px] py-2 rounded-[6px] cursor-pointer hover:bg-green-400">
              Save Catalogue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopProfile;
