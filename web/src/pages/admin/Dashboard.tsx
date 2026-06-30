import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { orderService, userService } from '../../services/api';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });

  useEffect(() => {
    Promise.all([
      orderService.getAll(),
      userService.getLivreurs(),
      userService.getCommerçants(),
    ]).then(([orders, livreurs, commercants]) => {
      const allOrders = orders.data;
      setStats({
        totalUsers: livreurs.data.length + commercants.data.length,
        totalOrders: allOrders.length,
        totalRevenue: allOrders
          .filter((o: { statusCommande: string }) => o.statusCommande === 'DELIVERED')
          .reduce((sum: number, o: { totalPrice: number }) => sum + o.totalPrice, 0),
        pendingOrders: allOrders.filter((o: { statusCommande: string }) => o.statusCommande === 'PENDING').length,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Administration</h1>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs', value: stats.totalUsers, color: 'bg-blue-50 text-blue-700' },
            { label: 'Commandes', value: stats.totalOrders, color: 'bg-purple-50 text-purple-700' },
            { label: 'En attente', value: stats.pendingOrders, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Revenu total', value: `${stats.totalRevenue.toFixed(0)} DA`, color: 'bg-green-50 text-green-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-4`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/admin/users" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-gray-700 mb-1">Gestion des utilisateurs</h2>
            <p className="text-sm text-gray-400">Gérer les livreurs, commerçants et clients</p>
          </Link>
          <Link to="/admin/orders" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-gray-700 mb-1">Gestion des commandes</h2>
            <p className="text-sm text-gray-400">Superviser toutes les commandes en cours</p>
          </Link>
        </div>
      </main>
    </div>
  );
}