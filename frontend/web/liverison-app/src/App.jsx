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
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="merchant" element={<Merchant />} />
        <Route path="shops" element={<Shops />} />
        <Route path="products" element={<Products />} />
          </Route>
      </Routes>
    </>
  );
}

export default App;
