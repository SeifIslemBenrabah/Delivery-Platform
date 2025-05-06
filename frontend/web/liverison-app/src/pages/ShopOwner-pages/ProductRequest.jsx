import React, { useState } from "react";
import InputLabel from "../../Components/InputLabel";
import { TbSquareArrowLeft } from "react-icons/tb";
import { IoPricetagsOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { SlPicture } from "react-icons/sl";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaArrowRight, FaTrash, FaRegCircleXmark } from "react-icons/fa6";
import { LuCircleMinus } from "react-icons/lu";
import { NavLink } from "react-router";

const ProductRequest = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productPicture, setProductPicture] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureWindow, setFeatureWindow] = useState(false);
  const [featureInputs, setFreatureInputs] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [fromError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const addInputs = () => {
    setFreatureInputs([...featureInputs, ""]);
  };
  const saveFeaturesHandler = () => {
    const typesFeature = [];
    let inputsvalid = true;
    featureInputs.forEach((e) => {
      if (e === "") {
        inputsvalid = false;
      }
    });
    if (newFeature === "" || featureInputs.length === 0 || !inputsvalid) {
      setFeatureError("you must fill the filed with informations!");
      console.log(featureError);
    } else {
      setFeatureError("");
      featureInputs.forEach((e) => {
        typesFeature.push(e);
      });
      setFeatures([...features, { feature: newFeature, types: typesFeature }]);
      setFeatureWindow(false);
      setNewFeature("");
      setFreatureInputs([]);
      setFeatureError("");
      console.log("it is working");
    }
  };
  const removeFeature = (item) => {
    setFeatures(
      features.filter((e) => {
        e.feature !== item;
      })
    );
  };
  const removeInput = () => {
    setFreatureInputs((prev) =>
      prev.filter((_, index) => index !== prev.length - 1)
    );
  };

  const handelInputchange = (index, value) => {
    const updateInputs = [...featureInputs];
    updateInputs[index] = value;
    setFreatureInputs(updateInputs);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="text-white w-fit rounded-[8px] bg-green-500 p-1.5 text-2xl cursor-pointer hover:bg-green-400">
          <NavLink to="../productslist">
            <TbSquareArrowLeft />
          </NavLink>
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl font-semibold">Product Request</h1>
          <div className="flex flex-col w-[65%] bg-gray-100 p-5 rounded-[16px]">
            <div className="flex gap-4 w-full">
              <InputLabel
                icon={IoPricetagsOutline}
                type="text"
                inputName="Product Name*"
                errorMassage=""
                value={productName}
                name="name"
                onchange={(e) => {
                  setProductName(e.target.value);
                }}
                affiche={false}
              />
              <InputLabel
                icon={RiMoneyDollarCircleLine}
                type="number"
                inputName="Product Price*(Da)"
                errorMassage=""
                value={productPrice}
                name="name"
                onchange={(e) => {
                  setProductPrice(e.target.value);
                }}
                affiche={false}
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex flex-col w-[49%] gap-2.5">
                <p>Description*</p>
                <textarea
                  type="text"
                  name="Description"
                  id=""
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Write the description of the product..."
                  className="bg-white h-20 w-full rounded-[6px] border p-2 "
                />
              </div>
              <div className="flex gap-5 justify-between mt-4 items-center">
                <div className="flex items-center gap-2">
                  <SlPicture className="text-2xl" />
                  <p className="text-gray-950 font-semibold">
                    Product Picture :
                  </p>
                </div>
                <label className="w-[32px] h-[32px] bg-green-500 flex justify-center items-center rounded text-white cursor-pointer">
                  <input
                    type="file"
                    name="national card"
                    id=""
                    className="hidden"
                    placeholder=" "
                    value={productPicture}
                    onChange={(e) => {
                      setProductPicture(e.target.value);
                    }}
                  />
                  <BsFileEarmarkPlus className="w-[20px] h-[20px]" />
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-[50%] mt-4">
              <div className="flex items-center justify-between w-full pr-2.5">
                <p className="text-[18px] text-gray-950">Features</p>
                <button
                  onClick={() => {
                    setFeatureWindow(true);
                  }}
                  className="flex items-center justify-center gap-1.5 bg-white border border-green-500 text-green-500 font-semibold px-2.5 py-1.5 rounded cursor-pointer hover:bg-green-100">
                  Add feature
                  <AiOutlinePlusCircle className="text-[18px]" />
                </button>
              </div>
              <div className=" flex flex-col text-[18px] gap-2.5  ">
                {features.map((e, i) => {
                  return (
                    <div className="flex justify-between">
                      <div key={i} className="flex gap-2.5 ">
                        <p className="font-semibold">{e.feature} : </p>
                        {e.types.map((t, i) => {
                          return <p key={i}>{t}</p>;
                        })}
                      </div>
                      <FaTrash
                        onClick={() => {
                          removeFeature(e);
                        }}
                        className="text-red-500 cursor-pointer "
                      />
                    </div>
                  );
                })}
              </div>
              {/* set error message here  */}
              <p className="text-red-500">{fromError}</p>
            </div>
            <div className="flex w-full justify-center">
              <button className="flex justify-between items-center w-[40%] bg-green-500 px-4 py-2 rounded text-white my-5 cursor-pointer hover:bg-green-400 ">
                Send Request <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
        {/* this is the new features window  */}
        {featureWindow && (
          <div className="fixed w-full inset-0 flex items-center justify-center gap-2.5 bg-[#000000a9] z-10">
            <div className="bg-white ml-45 rounded p-2 w-[400px]">
              <div className="flex justify-between mb-6">
                <h1 className=" w-full text-center">Add Feature</h1>
                <button
                  onClick={() => {
                    setFeatureWindow(false);
                    setFreatureInputs([]);
                    setNewFeature("");
                    setFeatureError("");
                  }}
                  className="cursor-pointer hover:text-gray-800">
                  <FaRegCircleXmark className="text-[20px]" />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex gap-1.5 w-full">
                  <input
                    type="text"
                    placeholder="Feature name"
                    className="w-[59%] border rounded px-2"
                    value={newFeature}
                    onChange={(e) => {
                      setNewFeature(e.target.value);
                      //   console.log(newFeature);
                    }}
                  />
                  <button
                    onClick={addInputs}
                    className="flex items-center justify-center gap-1 p-2 rounded-[8px] bg-white border border-green-500 text-green-500 font-semibold hover:bg-green-200">
                    Add Type <AiOutlinePlusCircle className="text-[18px]" />
                  </button>
                  <button
                    onClick={removeInput}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-[8px] bg-red-500   text-white font-semibold hover:bg-green-200">
                    <LuCircleMinus className="text-[18px]" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full h-fit mt-2.5">
                  {featureInputs.map((v, index) => {
                    return (
                      <input
                        key={index}
                        type="text"
                        value={v}
                        onChange={(e) => {
                          handelInputchange(index, e.target.value);
                        }}
                        placeholder="type value"
                        className="border p-1.5 rounded"
                      />
                    );
                  })}
                </div>
                <p className="text-[12px] text-red-500">{featureError}</p>
                <button
                  onClick={saveFeaturesHandler}
                  className="bg-green-500 w-[50%] rounded py-1.5 text-white font-semibold mt-4 cursor-pointer hover:bg-green-400">
                  Save Feature
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductRequest;
