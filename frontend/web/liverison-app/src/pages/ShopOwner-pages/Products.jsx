import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import ShopProductCard from "../../Components/ShopProductCard/ShopProductCard";
import productImage from "../../assets/img/Product-pic.png";

const Products = () => {
  const [search, setSearch] = useState("");
  const productList = [
    {
      image: `${productImage}`,
      name: "Nike Shos",
      price: 3000,
      description: "Sport pair of shos with not heavy weight ...",
    },
  ];
  return (
    <>
      <header className="  bg-[#F2F2F2] drop-shadow-[10px] p-4 pl-10 top-0 right-0 drop-shadow-gray-500">
        <h1 className="text-3xl font-bold text-green-500">Products</h1>
      </header>
      <div>
        <div className="flex justify-between items-center mt-10 mx-10">
          <div className="flex gap-4">
            <div className="w-[300px] h-[38px] border border-gray-900 rounded-[8px] flex items-center px-2 focus:border-2 focus:border-gray-950 ">
              <input
                type="search"
                name="product-search"
                id="product-search"
                placeholder="Search for Products"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full h-full outline-none border-none bg-transparent "
              />
              <FiSearch className="text-xl" />
            </div>
            <select
              name="catalogue-select"
              id="catalogue-select"
              className="w-[200px] py-1.5 border rounded-[8px]">
              <option value="">Select Catalogue</option>
              <option value="catalogue 1">catalogue 1</option>
              <option value="catalogue 1">catalogue 2</option>
            </select>
          </div>
          <button className="bg-gray-950 text-white text-[16px] w-[160px]  pt-1.5 pb-1.5 rounded flex gap-2.5 justify-center items-center hover:bg-gray-900 cursor-pointer">
            Add Product
            <AiOutlinePlusCircle className="text-[20px]" />
          </button>
        </div>
        <div className="w-full grid-cols-6 gap-2.5 mx-10 my-6">
          {productList
            .filter((e) => {
              search.toLowerCase() === ""
                ? e
                : e.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((e, i) => {
              return (
                <ShopProductCard
                  key={i}
                  image={e.image}
                  name={e.name}
                  price={e.price}
                  description={e.description}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Products;
