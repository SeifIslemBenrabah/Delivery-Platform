import { useState } from "react";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router";
import CommandItem from "../../Components/CommandItem";

const CommandsList = () => {
  const [search, setSearch] = useState("");

  const [CommandsList, setCommandsList] = useState([
    {
      products: [
        {
          produit: "681b524633821f2e40a1c20b",
          quantity: 2,
          infos: "Color: Red, Size: M",
        },
      ],
      price: 456,
      deliveryTiem: "15 min",
      time: "10:00",
    },
  ]);
  return (
    <div>
      <div className=" flex flex-col gap-5 justify-between items-center  ">
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
        <div className="bg-[#f3f3f3] h-fit w-full flex flex-col justify-center items-center gap-1.5 rounded-[16px] pb-4 ">
          <div className="flex justify-between items-center w-full py-4 px-6 ">
            <div className="flex justify-between items-center w-[70%]">
              <div className="w-[80px]  text-[16px] text-center text-[#232323]">
                idCommand
              </div>
              <div className=" w-[80px] text-[16px] text-center text-[#232323]">
                Products
              </div>
              <div className="w-[80px] text-[16px] text-center text-[#232323]">
                Price
              </div>
              <div className="w-[100px] text-[16px] text-center text-[#232323]">
                Delivery time
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
          {CommandsList.map((e, i) => {
            return (
              <CommandItem
                key={i}
                id={i + 1}
                productsNumber={e.products.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
                price={e.price}
                deliveryTime={e.deliveryTiem}
                time={e.time}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommandsList;
