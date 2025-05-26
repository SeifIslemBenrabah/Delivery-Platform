import React from "react";

const ShopProductCard = ({ image, name, price, description }) => {
  return (
    <div className="w-[160px] flex flex-col gap-1.5 items-center bg-[#f2f2f2] py-4 px-2.5 rounded-2xl text-gray-950">
      <img
        src={image}
        alt=""
        className="w-[90%] rounded-[8px]  shadow-gray-600"
      />
      <div className="flex justify-between w-full text-[14px] font-bold  ">
        <p>{name}</p>
        <p className="text-green-500">{price} Da</p>
      </div>
      <div>
        <p className="font-bold">Description</p>
        <p className="text-[14px] line-clamp-2 overflow-hidden text-gray-800">
          {description}
        </p>
      </div>
      <button className="bg-green-500 w-[90%] py-1 rounded text-white font-semibold cursor-pointer hover:bg-green-400">
        More Infos
      </button>
    </div>
  );
};

export default ShopProductCard;
