import React from "react";

import NavBar from "../Components/NavBar/NavBar";
import heroImage from "../assets/img/hero_pic.png";
import aboutUsImage from "../assets/img/Aboutus_pic.png";
import { BiSolidDollarCircle } from "react-icons/bi";
import {
  FaUser,
  FaShippingFast,
  FaFacebook,
  FaGoogle,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import servicesImg from "../assets/img/ourServices-bg.png";
import testimonia1 from "../assets/img/AhmedPic.png";
import testimonia2 from "../assets/img/KarimPic.png";
import testimonia3 from "../assets/img/SaraPic.png";
import testimoniaBg from "../assets/img/testimonia-bg.png";
import horizontalLogo from "../assets/img/horizantal-logo.png";
import { NavLink } from "react-router";
import Registration from "./Registration";
import Login from "./Login";

const LandingPage = () => {
  return (
    <div className="w-full">
      <NavBar />
      <div className="flex flex-col">
        <section
          id="home"
          className="bg-gradient-to-r from-white to-green-300 h-svh flex sm:flex-row flex-col-reverse  justify-between items-center relative min-h-fit ">
          <div className="flex flex-col  gap-2.5 ml-20 sm:mb-0 mb-10">
            <h1 className="text-gray-950 font-bold text-4xl mb-1 ">
              You Have Shop
            </h1>
            <div className="ml-18 text-2xl">
              <p className="text-gray-950 font-semibold">
                Want to Deliver Your Products
              </p>
              <p className="text-green-500 font-semibold">
                Fast and get More Customers
              </p>
            </div>
            <div className="flex flex-col gap-5 mt-22 ml-16 w-full">
              <button className="w-[90%] h-12 rounded text-2xl font-semibold text-white bg-green-600 ">
                Be Shop Owner
              </button>
              <button className="w-[90%] h-12 rounded text-2xl font-semibold text-white bg-gray-950 ">
                Be Delivery
              </button>
            </div>
          </div>
          <div className="w-[70%] relative mt-10 md:mt-0">
            <img src={heroImage} className=" w-full max-w-xl mx-auto" alt="" />
          </div>
        </section>
        {/* about us section */}
        <section
          id="aboutus"
          className="flex sm:flex-row flex-col items-center w-full gap-0 h-svh min-h-fit">
          <div className="m-4 mb-0 sm:h-[100%] h-fit   w-[95%] mt-8 ">
            <h1 className="text-green-500 text-4xl font-bold">
              Why Choose Name ?
            </h1>
            <img src={aboutUsImage} alt="" className="h-full  max-w-full" />
          </div>
          <div className=" flex flex-col gap-1.5  mt-0 sm:mr-9 mr-3 ml-3 ">
            <div className="flex flex-col  mb-3.5 bg-white border border-green-600 rounded-lg p-3 drop-shadow-sm ">
              <div className="text-2xl font-semibold text-green-500 flex gap-2.5 items-center">
                <BiSolidDollarCircle />
                More Profits
              </div>
              <p className="text-gray-800 text-base leading-snug text-balance font-medium">
                You can easily showcase your products, manage orders, and tap
                into a growing customer base—all while increasing your profits.
              </p>
            </div>
            <div className="flex flex-col  mb-3.5 bg-green-500  rounded-lg p-3  drop-shadow-sm ">
              <div className="text-2xl font-semibold text-white flex gap-2.5 items-center">
                <FaUser />
                More Customers
              </div>
              <p className="text-white text-base leading-snug text-balance font-medium">
                Imagine expanding your business beyond your physical location
                and reaching customers who prefer to order from home.
              </p>
            </div>
            <div className="flex flex-col  mb-3.5 bg-white border border-green-600 rounded-lg p-3 drop-shadow-sm ">
              <div className="text-2xl font-semibold text-green-500 flex gap-2.5 items-center">
                <FaShippingFast />
                Fastest Service
              </div>
              <p className="text-gray-800 text-base leading-snug text-balance font-medium">
                With our user-friendly system, you’ll save time, reduce overhead
                costs, and gain more visibility in the market.
              </p>
            </div>
            <div>
              <h1 className="text-green-500 text-3xl font-bold">
                With the Easiest way ever
              </h1>
              <div className="flex flex-col mt-4  mb-3.5 bg-green-500  rounded-lg p-4 drop-shadow-sm ">
                <p className="text-white leading-snug text-2xl  font-medium">
                  Just with few clicks you will get delivery job or get more
                  orders , customers , profits and Peace of mind.
                </p>
              </div>
              <div className="flex flex-col mt-4  mb-3.5 bg-gray-950  rounded-lg p-4 drop-shadow-sm justify-center items-center  ">
                <p className="text-white leading-snug text-2xl  font-medium">
                  What are you waiting to be one of us
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* this is the section of our services ... */}
        <section
          id="services"
          style={{
            backgroundImage: `url(${servicesImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="bg-green-500   w-full mt-16 h-svh min-h-fit ">
          <h1 className="text-white text-4xl font-bold ml-10 mt-5">
            Our Services
          </h1>
          <div className="flex flex-col gap-4 mt-8 ml-30 mb-8 mr-5  ">
            <div className="flex md:flex-row flex-col  gap-4 w-[60%] ">
              <div className="bg-white max-w-[309px] min-w-[240px] h-fit text-center p-3 rounded-2xl">
                <h2 className="sm:text-2xl  text-[18px] text-green-500 font-semibold ">
                  Set Your Products
                </h2>
                <p className="text-gray-950 mt-2 text-base leading-snug text-balance  sm:text-[20px]  text-[14px]">
                  You can set your products in our delivery app via website
                  created specialy for you and with that all you products will
                  be seen in the mobile app.
                </p>
              </div>
              <div className="bg-white max-w-[309px] min-w-[240px] h-fit text-center p-3 rounded-2xl">
                <h2 className="sm:text-2xl text-[18px]  text-green-500 font-semibold ">
                  Get Online Orders
                </h2>
                <p className=" mt-2 text-base leading-snug text-balance sm:text-[20px]  text-[14px] text-gray-950">
                  You will receive online orders from our app and you will have
                  the time to prepar them until the delivery came to take it to
                  the costumers.
                </p>
              </div>
            </div>
            <div className="flex md:flex-row flex-col gap-4 w-[60%] ml-36">
              <div className="bg-white max-w-[309px] min-w-[240px] h-fit text-center p-3 rounded-2xl">
                <h2 className="md:text-2xl text-[18px] text-green-500 font-semibold ">
                  Analys Your Income
                </h2>
                <p className="text-gray-950 mt-2 text-base leading-snug text-balance sm:text-[20px] text-[14px] ">
                  With clear statistics and easy-to-read dashboards, managing
                  your shop has never been simpler. That to make smarter
                  decision.
                </p>
              </div>
              <div className="bg-white max-w-[309px] min-w-[240px] h-fit text-center p-3 rounded-2xl">
                <h2 className="md:text-2xl text-[18px] text-green-500 font-semibold ">
                  Manage more Shops
                </h2>
                <p className="text-gray-950 mt-2 text-base leading-snug text-balance sm:text-[20px]  text-[14px]">
                  If you have more then one shop you can manage all of them just
                  in one web site in the same time with the easy way and gain
                  time.
                </p>
              </div>
            </div>
            <div className="flex md:flex-row flex-col gap-4 w-[60%]">
              <div className="bg-white max-w-[309px] min-w-[240px] h-fit text-center p-3 rounded-2xl">
                <h2 className="md:text-2xl text-[18px] text-green-500 font-semibold ">
                  Set Your Products
                </h2>
                <p className="text-gray-950 mt-2 text-base leading-snug text-balance sm:text-[20px]  text-[14px]">
                  You can set your products in our delivery app via website
                  created specialy for you and with that all you products will
                  be seen in the mobile app.
                </p>
              </div>
              <div className="bg-white max-w-[309px] min-w-[240px] h-fit text-center p-3 rounded-2xl">
                <h2 className="md:text-2xl text-[18px] text-green-500 font-semibold ">
                  Get Online Orders
                </h2>
                <p
                  className="text-gray-950 mt-2 text-base leading-snug text-balance sm:text-[20px]  text-[14px] "
                  d>
                  You will receive online orders from our app and you will have
                  the time to prepar them until the delivery came to take it to
                  the costumers.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonia"
          className=" bg-white  min-h-svh h-fit pb-5"
          style={{
            backgroundImage: `url(${testimoniaBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
          <h1 className="text-green-500 text-4xl font-bold ml-10 mt-5">
            Testimonia
          </h1>
          <div className="w-full flex sm:flex-row flex-col flex-wrap   gap-8  mt-40 items-center justify-center">
            {[
              {
                pic: testimonia1,
                tag: "Small Business Owner",
                parole:
                  '"Since joining this platform, our sales have increased by 40%! The app makes it so easy to manage orders, and customers love the real-time tracking. Best decision we made for our business!"',
                name: "Ahmed, Local Mart",
              },
              {
                pic: testimonia2,
                tag: "Motorcycle Delivery",
                parole:
                  '"Before, we only served walk-in customers. Now, with this app, we deliver fresh pastries across the city and our revenue has doubled! The analytics tools make managing everything a breeze."',
                name: "Karim Nawiga",
              },
              {
                pic: testimonia3,
                tag: "Resterant Owner",
                parole:
                  '"The dashboard helps me track daily profits and orders at a glance. We have reached so many new customers without any extra marketing effort. Highly recommend!"',
                name: "Sara, Haven Food",
              },
            ].map((e, i) => {
              return (
                <div
                  key={i}
                  className=" sm:w-[400px] w-[260px] max-w-[400px] min-w-[260px] flex flex-col   gap-3 text-center items-center  bg-gradient-to-t from-green-500 to-green-200 rounded-2xl p-5 text-white">
                  <img src={e.pic} alt="" className="w-[60%] " />
                  <h2 className="text-gray-950 font-bold sm:text-2xl text-[16px] ">
                    {e.tag}
                  </h2>
                  <p className="sm:text-[18px] text-[14px]">{e.parole}</p>
                  <p className="sm:text-[18px] text-[14px]">{e.name}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <footer className="bg-[#111111] text-white pt-5 ">
        <div className="flex-col">
          <div className="flex justify-between items-center text-center">
            <img
              src={horizontalLogo}
              alt=""
              className="w-fit h-fit sm:ml-6 ml-2"
            />
            <div className="flex flex-col gap-4 w-fit justify-center items-center  mr-6">
              <h1 className="text-3xl mb-5">
                Get Started with us & Register Now
              </h1>
              <button className="bg-white text-gray-950 w-[60%] h-[45px] rounded-[8px] hover:bg-gray-300">
                Register
              </button>
              <button className="bg-white text-gray-950 w-[60%] h-[45px] rounded-[8px] hover:bg-gray-300">
                Log In
              </button>
            </div>
          </div>
          <hr className="border-2 border-white m-5 rounded" />
          <div className="flex  justify-between items-center pb-6">
            <div className="sm:text-2xl text-[18px]  flex gap-4 ml-6">
              <FaWhatsapp className="hover:text-green-400" />
              <FaFacebook className="hover:text-green-400" />
              <FaXTwitter className="hover:text-green-400" />
              <FaGoogle className="hover:text-green-400" />
            </div>
            <div className="lg:text-2xl text-[14px] flex  gap-5 mr-6">
              <p className="hover:text-green-400">+213 0654822654</p>
              <p className="hover:text-green-400">Ourmailname456@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
  );
};



export default LandingPage;
