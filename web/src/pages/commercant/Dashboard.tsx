import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { orderService } from '../../services/api';
import type { Commande } from '../../types';

export default function CommercantDashboard() {
  const [orders, setOrders] = useState<Commande[]>([]);

  useEffect(() => {
    orderService.getMyOrders().then((r) => setOrders(r.data));
  }, []);

  const pending = orders.filter((o) => o.statusCommande === 'PENDING').length;
  const inProgress = orders.filter((o) =>
    ['CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'].includes(o.statusCommande)
  ).length;
  const totalRevenu = orders
    .filter((o) => o.statusCommande === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord Commerçant</h1>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'En attente', value: pending, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'En cours', value: inProgress, color: 'bg-blue-50 text-blue-700' },
            { label: 'Revenu total', value: `${totalRevenu.toFixed(2)} DA`, color: 'bg-green-50 text-green-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-4`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link to="/commercant/boutique" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            Gérer ma boutique
          </Link>
          <Link to="/commercant/produits" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Gérer les produits
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Commandes récentes</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune commande.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 10).map((o) => (
                <div key={o.idCommande} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700">#{o.idCommande.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{new Date(o.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{o.totalPrice.toFixed(2)} DA</p>
                    <p className="text-xs text-gray-400">{o.statusCommande}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}