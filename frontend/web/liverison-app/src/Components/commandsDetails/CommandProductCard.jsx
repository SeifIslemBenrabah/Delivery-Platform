import React from "react";
import { TbSquareArrowRight } from "react-icons/tb";
import { NavLink } from "react-router";

const CommandProductCard = ({ image, name, features, price, quantity }) => {
  return (
    <div className="flex justify-between items-center px-5 py-2.5 bg-white rounded-[8px]">
      <div className="flex gap-30 items-center">
        <img src={image} alt="" className="h-[40px] rounded" />
        <p className="text-[16px] text-gray-950 font-semibold">{name}</p>
        <p className="text-[16px] text-gray-950 font-semibold">{features}</p>
        <p className="text-[16px] text-green-500 font-semibold ">{price}</p>
        <p className="text-[16px] text-gray-950">{quantity}</p>
      </div>
      <button className="text-white bg-green-500 flex items-center gap-2.5 py-1.5 px-2.5 rounded-[8px] cursor-pointer hover:bg-green-400">
        <NavLink to="" className="flex items-center gap-2.5 ">
          See Details <TbSquareArrowRight />
        </NavLink>
      </button>
    </div>
  );
};

export default CommandProductCard;
