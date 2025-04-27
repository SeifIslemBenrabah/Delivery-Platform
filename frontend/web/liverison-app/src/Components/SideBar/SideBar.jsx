import React from "react";
import { NavLink } from "react-router";
import verticalLogo from "../../assets/img/VerticalLogo.png";
import { CiGrid31 } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import { LuShoppingBag } from "react-icons/lu";
import { BiLogOut } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";

const SideBar = () => {
  const SideBarItems = [
    {
      path: "dashboard",
      icon: <CiGrid31 className="text-[20px]" />,
      title: "Dash Board",
    },
    {
      path: "products",
      icon: <HiOutlineClipboardList className="text-[20px]" />,
      title: "Products",
    },
    {
      path: "commands",
      icon: <BsBoxSeam className="text-[20px]" />,
      title: "Commands",
    },
    {
      path: "shops",
      icon: <LuShoppingBag className="text-[20px]" />,
      title: "Shops",
    },
    {
      path: "profile",
      icon: <FaRegUser className="text-[20px]" />,
      title: "Profile",
    },
  ];
  return (
    <nav
      className="flex flex-col h-full
      items-center bg-[#F9F9F9]
     justify-between justify-self-start p-5 fixed drop-shadow-gray-400">
      <div className="flex flex-col gap-8 items-center">
        <div>
          <img src={verticalLogo} alt="" />
        </div>
        <div className="flex flex-col gap-1">
          {SideBarItems.map((e, i) => {
            console.log(e.title);
            return (
              <NavLink
                key={i}
                to={e.path}
                className={({ isActive }) =>
                  `flex items-center justify-center p-3 pt-2 pb-2  gap-3 rounded transition-colors ${
                    isActive
                      ? "bg-green-500 text-white font-bold hover:bg-green-300"
                      : "text-gray-900 hover:bg-gray-400"
                  }`
                }>
                {e.icon}
                <p className="w-[80%]">{e.title}</p>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 justify-center ">
        <button className="text-gray-900 justify-center   flex items-center gap-2.5 hover:text-green-500 cursor-pointer">
          <IoSettingsOutline className="text-[20px]" />
          Settings
        </button>
        <button className="bg-white border border-red-500 text-red-500 text-[16px] font-semibold p-3 pt-1 pb-1 rounded  flex items-center gap-2.5 cursor-pointer hover:bg-red-500 hover:text-white">
          <BiLogOut className="text-[20px]" />
          Log out
        </button>
      </div>
    </nav>
  );
};

export default SideBar;
