import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';

const STATUS_COLORS: Record<string, string> = {
  PENDING:     'bg-yellow-100 text-yellow-700',
  CONFIRMED:   'bg-blue-100 text-blue-700',
  ASSIGNED:    'bg-purple-100 text-purple-700',
  PICKED_UP:   'bg-indigo-100 text-indigo-700',
  IN_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED:   'bg-green-100 text-green-700',
  CANCELLED:   'bg-red-100 text-red-700',
};

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const { orders, loading, fetchMyOrders } = useOrderStore();

  useEffect(() => { fetchMyOrders(); }, [fetchMyOrders]);

  const recentOrders = orders.slice(0, 5);
  const delivered = orders.filter((o) => o.statusCommande === 'DELIVERED').length;
  const inProgress = orders.filter((o) =>
    ['CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'].includes(o.statusCommande)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Votre tableau de bord client</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total commandes', value: orders.length, color: 'bg-blue-50 text-blue-700' },
            { label: 'En cours', value: inProgress, color: 'bg-orange-50 text-orange-700' },
            { label: 'Livrées', value: delivered, color: 'bg-green-50 text-green-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-4`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Link
            to="/client/catalog"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Passer une commande
          </Link>
          <Link
            to="/client/orders"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Voir toutes mes commandes
          </Link>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Commandes récentes</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Chargement...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune commande pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.idCommande}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Commande #{order.idCommande.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleDateString('fr-FR')} · {order.totalPrice.toFixed(2)} DA
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.statusCommande]}`}>
                      {order.statusCommande}
                    </span>
                    {['ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'].includes(order.statusCommande) && (
                      <Link
                        to={`/client/tracking/${order.idCommande}`}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Suivre
                      </Link>
                    )}
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