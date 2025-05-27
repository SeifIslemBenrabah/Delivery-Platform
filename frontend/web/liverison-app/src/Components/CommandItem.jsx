import React from "react";
import { NavLink } from "react-router";
import { TbSquareArrowRight } from "react-icons/tb";

const CommandItem = ({ id, productsNumber, price, deliveryTime, time , url }) => {
  return (
    <div className="flex justify-between items-center w-[98%] py-3 px-4 bg-white rounded-[16px] ">
      <div className=" flex justify-between items-center w-[70%]">
        <p className="w-[80px] text-[16px] text-center text-[#232323] font-semibold">
          {id}
        </p>
        <p className="w-[80px] text-[16px] text-center text-[#232323] font-semibold">
          {productsNumber}
        </p>
        <p className="w-[80px] text-[16px] text-center text-[#232323] font-semibold">
          {price} Da
        </p>
        <p className="w-[100px] text-[16px] text-center text-[#232323] font-semibold">
          {deliveryTime}
        </p>
        <p className="w-[80px] text-[16px] text-center text-[#232323] font-semibold">
          {time}
        </p>
      </div>
      <NavLink
        to={url}
        className="bg-green-500   w-fit px-2 py-1.5 rounded cursor-pointer hover:bg-green-400">
        <p className="text-white  flex items-center justify-center gap-1.5">
          See Order
          <TbSquareArrowRight />
        </p>
      </NavLink>
    </div>
  );
};

export default CommandItem;
