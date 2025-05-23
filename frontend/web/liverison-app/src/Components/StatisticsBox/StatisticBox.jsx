import React from "react";

const StatisticBox = ({ statisName, data, picture }) => {
  return (
    <div className="bg-[#f7f7f7] w-[288px] h-[160px] rounded-[10px] border-green-500 border-[0.25px] p-3 flex gap-5 items-center justify-center">
      <img
        className="rounded-[50%] border-green-500 border-[0.25px] w-[45%]"
        src={picture}
        alt=""
      />
      <div className="text-center flex flex-col gap-3">
        <p className="font-semibold">{statisName}</p>
        <p className="text-green-500 font-bold">{data}</p>
      </div>
    </div>
  );
};

export default StatisticBox;
