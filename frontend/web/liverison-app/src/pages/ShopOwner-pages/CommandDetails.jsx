import React, { useState } from "react";
import { TbSquareArrowLeft } from "react-icons/tb";
import { NavLink } from "react-router";
import CommandInfosCard from "../../Components/commandsDetails/CommandInfosCard";
import CommandDeliveryCard from "../../Components/commandsDetails/CommandDeliveryCard";
import deliveryImg from "../../assets/img/AhmedPic.png";

const CommandDetails = () => {
  const [Command, setCommand] = useState({
    commandNumber: "1",
    productsNumber: 2,
    time: "10:00",
    price: 2500,
    deliverTime: "15:00 min",
    clientName: "Benrabah Seif Islam",
  });
  const [delivery, setdelivery] = useState({
    deliveryImg: `${deliveryImg}`,
    firstName: "abdou",
    lastName: " benazzi",
    phoneNumber: "065488795",
    email: "abdou7654@gmail.com",
  });
  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <div className="text-white w-fit rounded-[8px] bg-green-500 p-1.5 text-2xl cursor-pointer hover:bg-green-400">
          <NavLink to="../commandslist">
            <TbSquareArrowLeft />
          </NavLink>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <CommandInfosCard
              commandNumber={Command.commandNumber}
              productsNumber={Command.productsNumber}
              time={Command.time}
              price={Command.price}
              deliveryTime={Command.deliverTime}
              clientName={Command.clientName}
            />
            <CommandDeliveryCard
              deliveryImg={delivery.deliveryImg}
              firstName={delivery.firstName}
              lastName={delivery.lastName}
              phoneNumber={delivery.phoneNumber}
              email={delivery.email}
            />
          </div>
          <div className="bg-[#f0f0f0] p-5 h-fit w-[96%] rounded-2xl">
            <h2 className="text-[18px]">Command Products</h2>
            <div className="flex flex-col gap-1.5 w-full mt-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandDetails;
