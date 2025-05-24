import React from "react";

<<<<<<< HEAD
import loginBg from "../assets/img/loginBg.png";
import InputLabel from "../Components/InputLabel";
import { FaRegUser, FaUser } from "react-icons/fa";
import { BsFileEarmarkPlus, BsTelephone } from "react-icons/bs";
import { LuShoppingBag } from "react-icons/lu";
import { Link } from "react-router";
import verticalLogo from "../assets/img/VerticalLogo.png";
import { FiShield } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";

const Registration = () => {
  return (
    <div>
      <div
        className="flex h-[100vh]   justify-center items-center bg-cover bg-no-repeat bg-center "
        style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="bg-white w-[70%]  rounded-[24px] flex flex-col items-center">
          <div className="w-full flex justify-start">
            <img src={verticalLogo} alt="" className="ml-4 mt-2" />
          </div>
          <div className="flex flex-col w-full text-center items-center p-10 pt-2   gap-8">
            <div className="w-full">
              <h1 className="text-3xl text-gray-950">Registration Form</h1>
              <p className="text-[16px] text-gray-800">
                When you register you will wait until the adminstration accepte
                your request
              </p>
            </div>
            <div className="flex justify-between items-center w-full   gap-5">
              <div className="w-[50%] flex flex-col  items-center">
                <div className="flex w-[70%]   gap-4">
                  <InputLabel
                    icon={FaRegUser}
                    type="text"
                    inputName="First Name"
                    // value={firstname}
                    name="first Name"
                  />
                  <InputLabel
                    icon={FaRegUser}
                    type="text"
                    inputName="Last Name"
                    // value={firstname}
                    name="first Name"
                  />
                </div>
                <InputLabel
                  icon={MdOutlineMail}
                  type="email"
                  inputName="Email"
                  // value={firstname}
                  name="email"
                />
                <InputLabel
                  icon={BsTelephone}
                  type="tel"
                  inputName="Phone Number"
                  // value={firstname}
                  name="phone Number"
                />
                <InputLabel
                  icon={FiShield}
                  type="password"
                  inputName="Password"
                  // value={firstname}
                  name="password"
                  affiche={true}
                />
                <InputLabel
                  icon={FiShield}
                  type="password"
                  inputName="Comfirm Password"
                  // value={firstname}
                  name="comfirm password"
                />
              </div>
              <div className="w-[50%] flex flex-col items-center justify-center">
                <InputLabel
                  icon={LuShoppingBag}
                  type="text"
                  inputName="Shop Name"
                  // value={firstname}
                  name="shop name"
                />
                <div className="flex-col gap-3 mb-6 w-[70%] text-left">
                  <label htmlFor="" className="text-gray-500 mb-1.5 ">
                    Shop Type
                  </label>
                  <div className="relative">
                    <LuShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                    <select
                      id="basic-select"
                      name="basic-select"
                      className="pl-10 py-2 border rounded-md w-full">
                      <option value="">Select shop type</option>
                      <option value="option1">Type1</option>
                      <option value="option2">Type2</option>
                      <option value="option3">Type3</option>
                    </select>
                  </div>
                  <div className="flex w-[60%] justify-between mt-4 items-center">
                    <p className="text-gray-950 font-semibold">
                      National Card :
                    </p>
                    <label className="w-[32px] h-[32px] bg-green-500 flex justify-center items-center rounded text-white cursor-pointer">
                      <input
                        type="file"
                        name="national card"
                        id=""
                        className="hidden"
                        placeholder=" "
                      />
                      <BsFileEarmarkPlus className="w-[20px] h-[20px]" />
                    </label>
                  </div>
                  <div className="flex w-[60%] justify-between mt-4 items-center">
                    <p className="text-gray-950 font-semibold">Shop Papier :</p>
                    <label className="w-[32px] h-[32px] bg-green-500 flex justify-center items-center rounded text-white cursor-pointer">
                      <input
                        type="file"
                        name="Shop papier"
                        id=""
                        className="hidden "
                        placeholder=" "
                      />
                      <BsFileEarmarkPlus className="w-[20px] h-[20px]" />
                    </label>
                  </div>
                  <div className="flex w-[60%] justify-between mt-4 items-center">
                    <p className="text-gray-950 font-semibold">
                      Shop Picture :
                    </p>
                    <label className="w-[32px] h-[32px] bg-green-500 flex justify-center items-center rounded text-white cursor-pointer">
                      <input
                        type="file"
                        name="Shop picture"
                        id=""
                        className="hidden"
                        placeholder=" "
                      />
                      <BsFileEarmarkPlus className="w-[20px] h-[20px]" />
                    </label>
                  </div>
                  <div className=" w-full flex flex-col  text-left mt-20">
                    <input
                      type="button"
                      value="Registration"
                      // ref={userRef}
                      className=" bg-green-600 text-white w-full py-2 rounded hover:bg-green-500 cursor-pointer"
                      // onClick={() => submitHandle()}
                    />
                    <div className="w-[70%] flex items-start justify-start mt-2">
                      <p className="">Already have account ?</p>
                      <p className="ml-1.5 text-green-600 font-bold hover:text-green-500 cursor-pointer ">
                        <Link to="/login">Log in</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
=======
const Registration = () => {
  return (
    <div>
      <h1>Registration Page</h1>
>>>>>>> 6d523dfe4cd48b84b95f8a6161596c7130d1a271
    </div>
  );
};

export default Registration;
