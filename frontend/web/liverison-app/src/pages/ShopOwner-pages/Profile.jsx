import React, { useState } from "react";
import StatisticBox from "../../Components/StatisticsBox/StatisticBox";
import CatalogueListItem from "../../Components/CatalogueListItem";
import shopImg from "../../assets/img/Shop-pic.png";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ShopListItem from "../../Components/ShopListItem";

const Profile = () => {
  const [shops, setShops] = useState([
    {
      picture: `${shopImg}`,
      name: "Shop name",
      location: "La Maquetta , sidi belabbas ville",
      craetionDate: "24-05-2025",
    },
  ]);
  return (
    <>
      <header className="  bg-[#F2F2F2] drop-shadow-[10px] p-4 pl-10 top-0 right-0 drop-shadow-gray-500 z-15">
        <h1 className="text-3xl font-bold text-green-500">Profile</h1>
      </header>
      <div className="mt-10 flex flex-col gap-5 w-full px-10">
        <div className="flex  gap-4 items-center ">
          <div className="flex flex-col  gap-5 h-[350px] bg-gradient-to-tr from-green-500 to-white w-[70%]  rounded-[16px] p-5">
            <h1 className="text-2xl font-semibold">Informations Card</h1>
            <div className=" w-full flex flex-col gap-4 px-5  ">
              <div className=" w-full  flex items-center">
                <div className="w-[30%]">
                  <p>First Name :</p>
                  <p className="font-semibold">Abdelouaheb</p>
                </div>
                <div className="w-[30%]">
                  <p>Shops Number :</p>
                  <p className="font-semibold">2</p>
                </div>
                <div className="w-[30%]">
                  <p>Email Address :</p>
                  <p className="font-semibold">abdelouahebbenazzi@gmail.com</p>
                </div>
              </div>
              <div className=" w-full  flex  items-center">
                <div className="w-[30%]">
                  <p className="">Last name :</p>
                  <p className="font-semibold">Benazzi</p>
                </div>
                <div className="w-[30%]">
                  <p>Shops Request :</p>
                  <p className="font-semibold">0</p>
                </div>
              </div>
              <div className=" w-full  flex  items-center">
                <div className="w-[30%]">
                  <p className="">Phone Number :</p>
                  <p className="font-semibold">0654888924</p>
                </div>
                <div className="w-[30%]">
                  <p>Registarion Date :</p>
                  <p className="font-semibold">24-05-2025</p>
                </div>
              </div>
              <div className="flex justify-end w-full  gap-4 mt-8 ">
                {/* here will add the functionality to open pop window  */}
                <button className="flex items-center bg-green-500 rounded px-3 py-1.5 gap-3 text-white cursor-pointer hover:bg-green-400">
                  Add Payment Card
                  <AiOutlinePlusCircle />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 justify-center  items-center">
            <StatisticBox
              statisName="Total Profite"
              data="22500 Da"
              picture={shopImg}
            />
            <StatisticBox
              statisName="Total Commands"
              data="225"
              picture={shopImg}
            />
          </div>
        </div>
        <div className="bg-[#f0f0f0] p-5 h-fit w-[96%] rounded-2xl">
          <h2>Shops List</h2>
          <div className="flex flex-col gap-1.5 w-full mt-4">
            {shops.map((e, i) => {
              return (
                <ShopListItem
                  key={i}
                  name={e.name}
                  image={e.picture}
                  location={e.location}
                  creationDate={e.craetionDate}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
