import "./App.css";
import { Route, Routes, Navigate } from "react-router";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";

import ShopOwnerHome from "./pages/ShopOwnerHome";
import DashBoard from "./pages/ShopOwner-pages/DashBoard";
import ProductsOwner from "./pages/ShopOwner-pages/ProductsOwner";
import Commands from "./pages/ShopOwner-pages/Commands";
import ShopsOwner from "./pages/ShopOwner-pages/ShopsOwner";
import Profile from "./pages/ShopOwner-pages/Profile";
import ProductRequest from "./pages/ShopOwner-pages/ProductRequest";
import ProductsList from "./pages/ShopOwner-pages/ProductsList";
import ShopsList from "./pages/ShopOwner-pages/ShopsList";
import ShopProfile from "./pages/ShopOwner-pages/ShopProfile";
import CommandsList from "./pages/ShopOwner-pages/CommandsList";
import CommandDetails from "./pages/ShopOwner-pages/CommandDetails";

import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import Clients from "./pages/Clients";
import Deliveries from "./pages/Deliveries";
import Merchant from "./pages/Merchant";
import Shops from "./pages/Shops";
import Products from "./pages/Products";
import ClientDetails from "./pages/ClientDetails";
import DeliveriesDetails from "./pages/MerchantDetails";
import DeliveryRequests from "./pages/DeliveryRequests";
import MerchantDetails from "./pages/MerchantDetails";
import ShopDetails from "./pages/ShopDetails";
import ShopRequests from "./pages/ShopRequests";
import RequiredAuth from "./Context/RequiredAuth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />

        {/* <Route element={<RequiredAuth allowedRoles={["COMMERCANT"]} />}> */}
        <Route path="shopownerhome" element={<ShopOwnerHome />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="products" element={<ProductsOwner />}>
            <Route index element={<Navigate to="productslist" replace />} />
            <Route path="productrequest" element={<ProductRequest />} />
            <Route path="productslist" element={<ProductsList />} />
          </Route>
          <Route path="commands" element={<Commands />}>
            <Route index element={<Navigate to="commandslist" replace />} />
            <Route path="commandslist" element={<CommandsList />} />
            <Route path="commandsdetails" element={<CommandDetails />}>
              <Route path=":commandId" element={<CommandDetails />} />
            </Route>
          </Route>
          <Route path="shops" element={<ShopsOwner />}>
            <Route index element={<Navigate to="shopslist" replace />} />
            <Route path="shopslist" element={<ShopsList />} />
            <Route path="shopprofile" element={<ShopProfile />}>
              <Route path=":shopId" element={<ShopProfile />} />
            </Route>
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* </Route> */}

        <Route element={<RequiredAuth allowedRoles={["ADMIN"]} />}>
          <Route path="admin" element={<AdminHome />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="client/:id" element={<ClientDetails />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="DeliveryRequests" element={<DeliveryRequests />} />
            <Route path="deliverie/:id" element={<DeliveriesDetails />} />
            <Route path="merchant" element={<Merchant />} />
            <Route path="Merchant/:id" element={<MerchantDetails />} />
            <Route path="shops" element={<Shops />} />
            <Route path="ShopRequests" element={<ShopRequests />} />
            <Route path="shop/:id" element={<ShopDetails />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
