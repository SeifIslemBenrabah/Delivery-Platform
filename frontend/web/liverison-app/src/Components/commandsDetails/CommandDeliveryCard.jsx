import React from "react";

const CommandDeliveryCard = ({
  deliveryImg,
  firstName,
  lastName,
  phoneNumber,
  email,
}) => {
  return (
    <div className="w-[35%] flex flex-col justify-start items-start gap-4 bg-gradient-to-l from-green-400 to-white p-4 rounded-[16px] ">
      <h2 className="text-[16px] text-gray-950 ">Delivery Informations</h2>
      <div className="flex gap-4 items-center justify-center">
        <img src={deliveryImg} alt="" className="w-[100px]" />
        <div className="flex flex-col gap-4">
          <div className="flex gap-1.5">
            <p>Name:</p>
            <p className="font-semibold">{firstName + " " + lastName}</p>
          </div>
          <div className="flex gap-1.5">
            <p>Phone Number:</p>
            <p className="font-semibold">{phoneNumber}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5">
        <p>Email:</p>
        <p className="font-semibold">{email}</p>
      </div>
    </div>
  );
};

export default CommandDeliveryCard;
