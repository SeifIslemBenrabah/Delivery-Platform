import React, { useEffect, useState } from "react";
import { TbSquareArrowLeft } from "react-icons/tb";
import { NavLink, useParams } from "react-router";
import CommandInfosCard from "../../Components/commandsDetails/CommandInfosCard";
import CommandDeliveryCard from "../../Components/commandsDetails/CommandDeliveryCard";
import deliveryImg from "../../assets/img/AhmedPic.png";
import axios from "axios";

const CommandDetails = () => {
  const {commandId} = useParams();
  const [clientName , setClientName] = useState('')
  const [command, setCommand] = useState({
    // commandNumber: "1",
    // productsNumber: 2,
    // time: "10:00",
    // price: 2500,
    // deliverTime: "15:00 min",
    // clientName: "Benrabah Seif Islam",
  });
  const [delivery, setdelivery] = useState({
    deliveryImg: `${deliveryImg}`,
    firstName: "abdou",
    lastName: " benazzi",
    phoneNumber: "065488795",
    email: "abdou7654@gmail.com",
  });

  useEffect(()=>{
    async function getCommandById() {
      try {
        const res = await axios.get(
          `http://localhost:5050/commandes/${commandId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCommand(res?.data);
        console.log(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    getCommandById();
  } , [commandId])

  // useEffect(()=>{
  //   async function getClientByIdCommend() {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8082/users/${command.idClient}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       setClientName(res.data.firstName + '' + res.data.lastName);
  //       console.log(clientName);
  //     } catch (error) {
  //       console.log(error)
  //     }
      
  //   } 
  //   getClientByIdCommend();
  // },[command.idClient])

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
              // commandNumber={Command.commandNumber}
              // productsNumber={command.produits.length !== 0 &&
              //   command.produits.reduce(
              //   (total, item) => total + item.quantity,
              //   0
              // )}
              time={formatDateTime(command.time)}
              price={command.price}
              deliveryTime={command.Livraisontype}
              clientName={clientName}
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
