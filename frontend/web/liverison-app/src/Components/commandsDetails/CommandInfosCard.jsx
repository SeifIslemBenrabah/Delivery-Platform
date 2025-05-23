import React from "react";

const CommandInfosCard = ({
  commandNumber,
  productsNumber,
  price,
  deliveryTime,
  time,
  clientName,
}) => {
  return (
    <div className="w-[60%] flex flex-col gap-4 px-4 py-4 bg-gradient-to-tr from-green-500 to-white rounded-[16px]">
      <h2 className="text-[18px] font-semibold">Command Informations Card</h2>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 items-center justify-center border-r px-3">
          <div className="flex gap-3 items-center ">
            <p className="w-[200px]">Command N :</p>
            <p className="w-[80px]">{commandNumber}</p>
          </div>
          <div className="flex gap-3 items-center ">
            <p className="w-[200px]">Products Number :</p>
            <p className="w-[80px]">{productsNumber}</p>
          </div>
          <div className="flex gap-3 items-center ">
            <p className="w-[200px]">Command Time :</p>
            <p className="w-[80px]">{time}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start justify-center">
          <div className="flex gap-3 items-center ">
            <p className="w-[200px]">Command Price :</p>
            <p className="w-[80px]">{price}</p>
          </div>
          <div className="flex gap-3 items-center ">
            <p className="w-[200px]">Delivery Time :</p>
            <p className="w-[80px] text-green-500 font-semibold">
              {deliveryTime}
            </p>
          </div>
          <div className="flex flex-col gap-3  ">
            <p className="w-[200px]">Client Name :</p>
            <p className="font-semibold ">{clientName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandInfosCard;
