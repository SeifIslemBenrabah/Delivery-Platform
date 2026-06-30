import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks: Record<string, { label: string; href: string }[]> = {
    CLIENT: [
      { label: 'Accueil', href: '/client' },
      { label: 'Catalogue', href: '/client/catalog' },
      { label: 'Mes commandes', href: '/client/orders' },
    ],
    LIVREUR: [
      { label: 'Tableau de bord', href: '/livreur' },
      { label: 'Mon itinéraire', href: '/livreur/route' },
    ],
    COMMERCANT: [
      { label: 'Tableau de bord', href: '/commercant' },
      { label: 'Boutique', href: '/commercant/boutique' },
      { label: 'Produits', href: '/commercant/produits' },
    ],
    ADMIN: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Utilisateurs', href: '/admin/users' },
      { label: 'Commandes', href: '/admin/orders' },
    ],
  };

  const links = user ? (navLinks[user.role] ?? []) : [];

  return (
    <nav className="bg-primary-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg tracking-tight">DeliveryPlatform</span>
        {links.map((l) => (
          <Link key={l.href} to={l.href} className="text-sm hover:text-blue-200 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">{user?.firstName} {user?.lastName}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-primary-600 text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}