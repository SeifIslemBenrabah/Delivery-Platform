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
          <Route path="products" element={<Products />} />
          <Route path="commands" element={<Commands />} />
          <Route path="shops" element={<Shops />} />
          <Route path="profile" element={<Profile />} />s
        </Route>
      </Routes>
    </>
  );
}

export default App;
