import React from "react";
import { TbSquareArrowRight } from "react-icons/tb";
import { NavLink } from "react-router";

const CatalogueListItem = ({ catalogeName, productsNumber, creationDate }) => {
  return (
    <div className="flex justify-between items-center px-5 py-2.5 bg-white rounded-[8px]">
      <div className="flex gap-30">
        <p className="w-[180px] text-[16px] text-gray-950 font-semibold">
          {catalogeName}
        </p>
        <p className="w-[180px] text-[16px] text-gray-950 font-semibold">
          {productsNumber}
        </p>
        <p className=" text-[16px] text-gray-950">{creationDate}</p>
      </div>
      <button className="text-white bg-green-500 flex items-center gap-2.5 py-1.5 px-2.5 rounded-[8px] cursor-pointer hover:bg-green-400">
        <NavLink to="../../products" className="flex items-center gap-2.5">
          See Details <TbSquareArrowRight />
        </NavLink>
      </button>
    </div>
  );
};

export default CatalogueListItem;
