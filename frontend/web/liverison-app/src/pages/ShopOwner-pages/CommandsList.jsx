import { useState, useEffect } from "react";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router";
import CommandItem from "../../Components/CommandItem";
import axios from "axios";

const CommandsList = () => {
  // const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState("all");
  const [shopsList, setShopsList] = useState([]);

  const [commandList, setCommandList] = useState([
    // {
    //   products: [
    //     {
    //       produit: "681b524633821f2e40a1c20b",
    //       quantity: 2,
    //       infos: "Color: Red, Size: M",
    //     },
    //   ],
    //   price: 456,
    //   deliveryTiem: "15 min",
    //   time: "10:00",
    // },
  ]);

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
        // localStorage.setItem("shops", JSON.stringify(shopsList));
        // console.log(responce?.data);?
        // console.log("hello world is working");
      } catch (error) {
        if (error.responce.status === 400) {
          console.log("error 400");
        }
      }
    }
    fetchShops();
  }, []);

  useEffect(() => {

    async function fetchCommand() {
      try {
        if (selectedShop === 'all') {
          const responce = await axios.get(
            `http://localhost:5050/commandes/Commarcent/${localStorage.getItem(
              "userId"
            )}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setCommandList(responce?.data?.data);
          console.log(responce.data.data)
        } else {
          const responce = await axios.get(
            `http://localhost:5050/commandes/boutique/${selectedShop}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setCommandList(responce?.data?.data);
          console.log(responce?.data?.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCommand();
    
  },[selectedShop]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    // const year = date.getFullYear();
    // const month = `0${date.getMonth() + 1}`.slice(-2); // Month is 0-indexed
    // const day = `0${date.getDate()}`.slice(-2);

    let hours = date.getHours();
    const minutes = `${date.getMinutes()}`.slice(-2);
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    return ` ${hours}:${minutes}${ampm}`;
  };

  return (
    <div>
      <div className=" flex flex-col gap-5 justify-between   ">
        {/* <div className=" w-full flex items-center justify-between "> */}
        {/* <div className="w-[300px] h-[38px] border border-gray-900 rounded-[8px] flex items-center px-2 focus:border-2 focus:border-gray-950 ">
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
          </div> */}
        {/* <div className="flex gap-0 items-center  w-fit  border-[0.25px] border-green-500 rounded-[8px]">
            <div
              className={`text-center flex items-center justify-center  w-[120px] h-[40px] text-[18px] font-semibold rounded-[8px] cursor-pointer ${
                statusIs === "all"
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500"
              }`}
              onClick={() => {
                setStatusIs("all");
              }}>
              All
            </div>
            <div
              className={`text-center flex items-center justify-center  w-[120px] h-[40px] text-[18px] font-semibold rounded-[8px] cursor-pointer ${
                statusIs === "notready"
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-500"
              }`}
              onClick={() => {
                setStatusIs("notready");
              }}>
              Not Ready
            </div>
            <div
              className={`text-center flex items-center justify-center  w-[120px] h-[40px] text-[18px] font-semibold rounded-[8px] cursor-pointer ${
                statusIs === "picked"
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500"
              }`}
              onClick={() => {
                setStatusIs("picked");
              }}>
              Picked
            </div>
          </div> */}
        {/* </div> */}
        <select
          name="shop-select"
          id="shop-select"
          className="w-[200px] py-1.5 border rounded-[8px]"
          onChange={(e) => {
            setSelectedShop(e.target.value);
          }}>
          <option value="all">Select shop</option>
          {shopsList.length !== 0 &&
            shopsList.map((e) => {
              return (
                <option key={e._id} value={e._id}>
                  {e.nomBoutique}
                </option>
              );
            })}
        </select>
        <div className="bg-[#f3f3f3] h-fit w-full flex flex-col justify-center items-center gap-1.5 rounded-[16px] pb-4 ">
          <div className="flex justify-between items-center w-full py-4 px-6 ">
            <div className="flex justify-between items-center w-[70%]">
              <div className="w-[80px]  text-[16px] text-center text-[#232323]">
                Command
              </div>
              <div className=" w-[80px] text-[16px] text-center text-[#232323]">
                Products
              </div>
              <div className="w-[80px] text-[16px] text-center text-[#232323]">
                Price
              </div>
              <div className="w-[100px] text-[16px] text-center text-[#232323]">
                Delivery type
              </div>
              <div className="w-[80px] text-[16px] text-center text-[#232323]">
                Time
              </div>
            </div>
            <div className="w-[120px] text-[16px] text-center text-[#232323]">
              Action
            </div>
          </div>
          <hr className="w-[98%]  rounded" />
          {commandList.map((e, i) => {
            return (
              <CommandItem
                key={i}
                id={i + 1}
                productsNumber={
                  e.produits.length !== 0 &&
                  e.produits.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
                price={e.price}
                deliveryTime={e.Livraisontype}
                time={formatDateTime(e.time)}
                url = {`../commandsdetails/${e._id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommandsList;
