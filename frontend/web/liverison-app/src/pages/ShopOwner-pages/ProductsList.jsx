import React, { use, useEffect, useState } from "react";
import productImage from "../../assets/img/Product-pic.png";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ShopProductCard from "../../Components/ShopProductCard/ShopProductCard";
import axios from "axios";

const ProductsList = () => {
  const [search, setSearch] = useState("");
  const [cataloges, setCatalogues] = useState();
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCatalogue, setSelectedCatalogue] = useState("");
  // const shopsList = JSON.parse(localStorage.getItem("shops"));
  const [shopsList, setShopsList] = useState([]);

  //   const [productWindow , setProductWindow] =
  const productList = [
    {
      image: `${productImage}`,
      name: "Nike Shos",
      price: 3000,
      description: "Sport pair of shos with not heavy weight ...",
    },
  ];

  useEffect(() => {
    async function fetchShops() {
      try {
        const responce = await axios.get(
          `http://localhost:5050/boutiques/Commercant/${localStorage.getItem(
            "userId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setShopsList(responce?.data);
        // localStorage.setItem("shops", JSON.stringify(shopsList));
        console.log(responce?.data);
        console.log("hello world is working");
      } catch (error) {
        if (error.responce.status === 400) {
          console.log("error 400");
        }
      }
    }
    fetchShops();
  }, []);

  useEffect(() => {
    async function fetchCataloguesByShop() {
      shopsList.map((e) => {
        if (e._id === selectedShop) {
          setCatalogues(e.catalogues);
          console.log("the catalogues are loaded..");
        }
      });
    }
    fetchCataloguesByShop();
  }, [selectedShop]);
  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="flex gap-2">
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
            className="w-[200px] py-1.5 border rounded-[8px]"
            onChange={(e) => {
              setSelectedShop(e.target.value);
            }}>
            <option value="">Select shop</option>
            {shopsList.length !== 0 &&
              shopsList.map((e) => {
                return (
                  <option key={e._id} value={e._id}>
                    {e.nomBoutique}
                  </option>
                );
              })}
          </select>
          <select
            name="catalogue-select"
            id="catalogue-select"
            className="w-[200px] py-1.5 border rounded-[8px]">
            <option value="">Select Catalogue</option>
            {}
          </select>
        </div>
        <button className="bg-gray-950 text-white text-[16px] w-[160px]  pt-1.5 pb-1.5 rounded flex gap-2.5 justify-center items-center hover:bg-gray-900 cursor-pointer">
          <NavLink
            to="../productrequest"
            className="flex items-center gap-1.5 ">
            Add Product
            <AiOutlinePlusCircle className="text-[20px]" />
          </NavLink>
        </button>
      </div>
      <div className="w-full grid-cols-6 gap-2.5  my-6">
        {productList.map((e, i) => {
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
  );
};

export default ProductsList;
