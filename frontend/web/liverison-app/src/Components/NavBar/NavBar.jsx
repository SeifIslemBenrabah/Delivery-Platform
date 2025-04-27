import React, { useState } from "react";
import logo from "../../assets/img/VerticalLogo.png";
import "../NavBar/navBar.css";
import { IoMenu } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { NavLink } from "react-router";

const NavBar = () => {
  const [isActive, setIsActive] = useState(false);
  const menuActivation = () => {
    setIsActive(!isActive);
  };

  const menuList = [
    { path: "#home", link: "Home" },
    { path: "#services", link: "Services" },
    { path: "#testimonia", link: "Testimonia" },
    { path: "#aboutus", link: "About Us" },
  ];

  const clickLinkMenu = (e) => {
    document.querySelectorAll(".dropMenu a").forEach((link) => {
      link.classList.remove("activeDrop");
    });
    e.target.classList.add("activeDrop");
    setIsActive(!isActive);
  };
  const clickMenuBar = (e) => {
    document.querySelectorAll(".menuBar a").forEach((link) => {
      link.classList.remove("active");
    });
    e.target.classList.add("active");
  };
  return (
    <>
      <div className="flex justify-between bg-gray-50 items-center h-16">
        <div className="ml-5">
          <img src={logo} alt="" />
        </div>
        <div className="sm:flex hidden mr-5 ">
          <ul className="flex gap-10 text-gray-950 font-bold menuBar ">
            {menuList.map((e, i) => {
              return (
                <li onClick={clickMenuBar} key={i}>
                  <a href={e.path}>{e.link}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sm:hidden inline mr-5">
          {!isActive ? (
            <IoMenu className="size-7" onClick={menuActivation} />
          ) : (
            <RxCrossCircled className="size-7" onClick={menuActivation} />
          )}
        </div>
        <div className="md:flex gap-2.5 mr-5 hidden">
          <button className="bg-green-500 text-white w-26 h-10 rounded font-bold">
            log in
          </button>
          <button className=" border-green-500 border bg-white text-green-500 w-26 h-10 rounded font-bold">
            Register
          </button>
        </div>
      </div>
      <div
        className={`sm:hidden flex bg-green-500 ${
          !isActive ? "hidden" : "flex"
        }`}>
        <ul className="flex flex-col gap-4 m-4 text-white dropMenu">
          {menuList.map((e, i) => {
            return (
              <li onClick={clickLinkMenu} key={i}>
                <a href={e.path}>{e.link}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
