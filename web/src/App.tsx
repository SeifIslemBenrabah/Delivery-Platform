import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import type { Role } from './types';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import ClientOrders from './pages/client/Orders';
import ClientTracking from './pages/client/Tracking';
import ClientCatalog from './pages/client/Catalog';

// Livreur pages
import LivreurDashboard from './pages/livreur/Dashboard';
import LivreurRoute from './pages/livreur/Route';

// Commerçant pages
import CommercantDashboard from './pages/commercant/Dashboard';
import CommercantBoutique from './pages/commercant/Boutique';
import CommercantProduits from './pages/commercant/Produits';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';

function RequireAuth({ children, role }: { children: React.ReactNode; role?: Role }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RoleHome() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  const redirects: Record<Role, string> = {
    CLIENT: '/client',
    LIVREUR: '/livreur',
    COMMERCANT: '/commercant',
    ADMIN: '/admin',
  };
  return <Navigate to={redirects[user.role]} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RoleHome />} />

        {/* Client */}
        <Route path="/client" element={<RequireAuth role="CLIENT"><ClientDashboard /></RequireAuth>} />
        <Route path="/client/orders" element={<RequireAuth role="CLIENT"><ClientOrders /></RequireAuth>} />
        <Route path="/client/tracking/:orderId" element={<RequireAuth role="CLIENT"><ClientTracking /></RequireAuth>} />
        <Route path="/client/catalog" element={<RequireAuth role="CLIENT"><ClientCatalog /></RequireAuth>} />

        {/* Livreur */}
        <Route path="/livreur" element={<RequireAuth role="LIVREUR"><LivreurDashboard /></RequireAuth>} />
        <Route path="/livreur/route" element={<RequireAuth role="LIVREUR"><LivreurRoute /></RequireAuth>} />

        {/* Commerçant */}
        <Route path="/commercant" element={<RequireAuth role="COMMERCANT"><CommercantDashboard /></RequireAuth>} />
        <Route path="/commercant/boutique" element={<RequireAuth role="COMMERCANT"><CommercantBoutique /></RequireAuth>} />
        <Route path="/commercant/produits" element={<RequireAuth role="COMMERCANT"><CommercantProduits /></RequireAuth>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth role="ADMIN"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth role="ADMIN"><AdminUsers /></RequireAuth>} />
        <Route path="/admin/orders" element={<RequireAuth role="ADMIN"><AdminOrders /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}