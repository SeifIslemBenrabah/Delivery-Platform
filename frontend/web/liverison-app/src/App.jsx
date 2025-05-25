import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import Clients from "./pages/Clients";
import Deliveries from "./pages/Deliveries";
import Merchant from "./pages/Merchant";
import Shops from "./pages/Shops";
import Products from "./pages/Products";
import ClientDetails from "./pages/ClientDetails"
import DeliveriesDetails from "./pages/MerchantDetails";
import  DeliveryRequests from './pages/DeliveryRequests'
import MerchantDetails from './pages/MerchantDetails'
import ShopDetails from "./pages/ShopDetails";
import ShopRequests from './pages/ShopRequests'
import MerchantRequests from "./pages/MerchantRequests";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="admin" element={<AdminHome />}>
        <Route index element={<AdminDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="client/:id" element={<ClientDetails />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="DeliveryRequests" element={< DeliveryRequests />} />
        <Route path="deliverie/:id" element={<DeliveriesDetails />} />
        <Route path="merchant" element={<Merchant />} />
        <Route path="MerchantRequests" element={< MerchantRequests />} />
        <Route path="Merchant/:id" element={<MerchantDetails />} />
        <Route path="shops" element={<Shops />} />
        <Route path="ShopRequests" element={< ShopRequests />} />
        <Route path="shop/:id" element={<ShopDetails/>} />
        <Route path="products" element={<Products />} />
        
          </Route>
      </Routes>
    </>
  );
}

export default App;
