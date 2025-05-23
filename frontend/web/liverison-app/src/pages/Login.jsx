import React, { useContext, useEffect, useRef, useState } from "react";
import InputLabel from "../Components/InputLabel";
import { MdOutlineMail } from "react-icons/md";
import { FiShield } from "react-icons/fi";
import logo from "../assets/img/VerticalLogo.png";
import loginImg from "../assets/img/LoginImage.png";
import loginBg from "../assets/img/loginBg.png";
import { Link, Navigate } from "react-router";
import axios from "axios";
import AuthContext from "../Context/AuthProvider";

const LOGIN_URL = "http://localhost:8080/api/v1/auth/authenticate";

const Login = () => {
  const userRef = useRef();
  const { setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPwd(value);
    }
  };

  const submitHandle = async () => {
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({}), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));

      const accessToken = response?.data.accessToken;
      setAuth({ email, pwd, accessToken });
      setEmail("");
      setPwd("");
      // Navigate({ to: "/shopownerhome" });
      setSuccess(true);
      console.log(accessToken, "this is the response" + response);
    } catch (err) {
      if (!err?.response) {
        setPasswordError("No Server Response");
      } else if (err.response?.status === 400) {
        if (email === "") {
          setEmailError("missing email or invalid!");
        } else if (pwd === "") {
          setPasswordError("missing password or invalid!");
        }
      } else if (err.response?.status === 401) {
        setPasswordError("informations not found!");
      } else setPasswordError("Login Failed!");
    }
  };

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
              errorMassage={emailError}
              value={email}
              name="email"
              onchange={handleChangeData}
            />
            <InputLabel
              icon={FiShield}
              type="password"
              inputName="Password"
              errorMassage={passwordError}
              value={pwd}
              name="password"
              onchange={handleChangeData}
              affiche={true}
            />
          </div>
          <div className=" w-full flex flex-col items-center mt-8">
            <input
              type="button"
              value="Login"
              ref={userRef}
              className=" bg-green-600 text-white w-[70%] py-2 rounded hover:bg-green-500 cursor-pointer"
              onClick={() => submitHandle()}
            />
            <div className="w-[70%] flex items-start justify-start mt-2">
              <p className="">Don't have account ?</p>
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
