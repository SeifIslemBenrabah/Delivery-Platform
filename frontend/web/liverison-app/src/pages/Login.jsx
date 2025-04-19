import React from "react";
import InputLabel from "../Components/InputLabel";
import { MdOutlineMail } from "react-icons/md";
import { FiShield } from "react-icons/fi";
import logo from "../assets/img/VerticalLogo.png";
import loginImg from "../assets/img/LoginImage.png";
import loginBg from "../assets/img/loginBg.png";

import { Link } from "react-router";

const Login = () => {
  return (
    <div
      className="flex h-[100vh]   justify-center items-center bg-cover bg-no-repeat bg-center "
      style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="flex gap-6 w-[60%] h-[70vh]  rounded-2xl bg-white shadow-gray-400 ">
        <div className="bg-green-300 w-[40%] rounded-bl-2xl rounded-tl-2xl sm:flex sm:flex-col sm:items-center hidden">
          <div className="w-full pt-2.5 pl-2.5 ">
            <img src={logo} alt="" />
          </div>
          <div className="w-full h-[80%] flex items-center justify-center">
            <img src={loginImg} alt="" />
          </div>
        </div>
        <div className="sm:w-[60%] flex flex-col  justify-center w-[100%] text-center ">
          <h2 className="font-bold text-3xl mb-10">LOG IN</h2>
          <div className=" flex flex-col items-center ">
            <InputLabel
              icon={MdOutlineMail}
              type="email"
              inputName="Email"
              errorMassage="invalid email"
            />
            <InputLabel
              icon={FiShield}
              type="password"
              inputName="Password"
              errorMassage="invalid password"
            />
          </div>
          <div className=" w-full flex flex-col items-center mt-8">
            <input
              type="button"
              value="Login"
              className=" bg-green-600 text-white w-[70%] py-2 rounded hover:bg-green-500 cursor-pointer"
            />
            <div className="w-[70%] flex items-start justify-start mt-2">
              <p>Don't habe account ?</p>
              <p className="ml-1.5 text-green-600 font-bold hover:text-green-500 cursor-pointer ">
                <Link to="/registration">Registration</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
