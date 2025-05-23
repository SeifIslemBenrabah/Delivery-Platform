import React from "react";

const InputLabel = ({
  icon: Icon,
  type,
  inputName,
  errorMassage,
  value,
  onchange,
  name,
  affiche,
}) => {
  return (
    <div className="flex-col gap-2 mb-6 w-[70%]">
      <div className="flex justify-between mb-1">
        <p className="text-gray-500">{inputName}</p>
        <p
          className={`${
            type == "password" && affiche === true ? "inline" : "hidden"
          } text-green-500 underline decoration-1 cursor-pointer hover:text-green-800`}>
          Forget Password?
        </p>
      </div>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
        <input
          type={type}
          placeholder={inputName}
          className="pl-10 py-2 border rounded-md w-full"
          value={value}
          onChange={onchange}
          name={name}
        />
      </div>
      <p className="text-left w-full text-red-500 ">{errorMassage}</p>
    </div>
  );
};

export default InputLabel;