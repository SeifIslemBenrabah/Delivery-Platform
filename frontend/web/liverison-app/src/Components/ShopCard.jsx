import React from "react";
import { NavLink } from "react-router";

const ShopCard = ({ image, name, phone, location, urlProfile }) => {
  return (
    <div className="w-[160px] flex flex-col gap-1.5 items-center bg-[#f2f2f2] py-4 px-2.5 rounded-2xl text-gray-950">
      <img
        src={image}
        alt=""
        className="w-[90%] rounded-[8px] shadow-md shadow-gray-300  overflow-hidden"
      />
      <div className="flex flex-col gap-2.5 justify-between w-full text-[14px] ">
        <p className="font-semibold">{name}</p>
        <p>{phone}</p>
      </div>
      <p className="text-[14px] line-clamp-1 overflow-hidden text-gray-800">
        {location}
      </p>
      <button className="bg-green-500 w-[90%] py-1 rounded text-white font-semibold cursor-pointer hover:bg-green-400">
        <NavLink to={urlProfile}>More Infos</NavLink>
      </button>
    </div>
  );
};

export default ShopCard;
