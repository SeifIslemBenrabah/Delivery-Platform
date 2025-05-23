import { Route, Routes, Navigate } from "react-router";

import "./App.css";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";
import ShopOwnerHome from "./pages/ShopOwnerHome";
import DashBoard from "./pages/ShopOwner-pages/DashBoard";
import Products from "./pages/ShopOwner-pages/Products";
import Commands from "./pages/ShopOwner-pages/Commands";
import Shops from "./pages/ShopOwner-pages/Shops";
import Profile from "./pages/ShopOwner-pages/Profile";
import ProductRequest from "./pages/ShopOwner-pages/ProductRequest";
import ProductsList from "./pages/ShopOwner-pages/ProductsList";
import ShopsList from "./pages/ShopOwner-pages/ShopsList";
import ShopProfile from "./pages/ShopOwner-pages/ShopProfile";
import CommandsList from "./pages/ShopOwner-pages/CommandsList";
import CommandDetails from "./pages/ShopOwner-pages/CommandDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="shopownerhome" element={<ShopOwnerHome />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="products" element={<Products />}>
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
          <Route path="shops" element={<Shops />}>
            <Route index element={<Navigate to="shopslist" replace />} />
            <Route path="shopslist" element={<ShopsList />} />
            <Route path="shopprofile" element={<ShopProfile />}>
              <Route path=":shopId" element={<ShopProfile />} />
            </Route>
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
