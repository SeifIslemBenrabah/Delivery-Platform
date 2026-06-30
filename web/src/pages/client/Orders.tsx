import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { useOrderStore } from '../../store/orderStore';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  ASSIGNED: 'Assignée',
  PICKED_UP: 'Collectée',
  IN_DELIVERY: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  ASSIGNED: 'bg-purple-100 text-purple-700',
  PICKED_UP: 'bg-indigo-100 text-indigo-700',
  IN_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function ClientOrders() {
  const { orders, loading, fetchMyOrders } = useOrderStore();

  useEffect(() => { fetchMyOrders(); }, [fetchMyOrders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Mes commandes</h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Chargement...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Aucune commande</p>
            <Link to="/client/catalog" className="text-primary-600 text-sm hover:underline mt-2 block">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.idCommande} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      Commande #{order.idCommande.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(order.date).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {order.dropOffAddress}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.statusCommande]}`}>
                      {STATUS_LABELS[order.statusCommande]}
                    </span>
                    <p className="text-sm font-semibold text-gray-700">
                      {order.totalPrice.toFixed(2)} DA
                    </p>
                  </div>
                </div>

                {['ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'].includes(order.statusCommande) && (
                  <Link
                    to={`/client/tracking/${order.idCommande}`}
                    className="mt-3 inline-block text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    Suivre en temps réel →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}