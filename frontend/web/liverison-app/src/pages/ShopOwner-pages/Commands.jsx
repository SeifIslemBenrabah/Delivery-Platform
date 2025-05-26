import React from "react";
import { Outlet } from "react-router";
const Commands = () => {
  return (
    <>
      <header className="  bg-[#F2F2F2] drop-shadow-[10px] p-4 pl-10 top-0 right-0 drop-shadow-gray-500 z-15">
        <h1 className="text-3xl font-bold text-green-500">Commands</h1>
      </header>
      <div className="m-10">
        <Outlet />
      </div>
    </>
  );
};

export default Commands;
