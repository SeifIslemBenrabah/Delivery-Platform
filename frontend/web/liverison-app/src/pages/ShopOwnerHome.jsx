import React from "react";
import { Outlet, Route, Routes } from "react-router";
import SideBar from "../Components/SideBar/SideBar";
import Products from "./ShopOwner-pages/ProductsOwner";

const ShopOwnerHome = () => {
  return (
    <div className="h-lvh">
      <SideBar className="fixed" />
      <div className="flex-1 ml-[220px] flex flex-col h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ShopOwnerHome;
