import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { orderService } from '../../services/api';
import { connectSocket, emitLivreurPosition } from '../../services/socket';
import type { Commande } from '../../types';

export default function LivreurDashboard() {
  const [available, setAvailable] = useState<Commande[]>([]);
  const [myOrders, setMyOrders] = useState<Commande[]>([]);
  const [sharing, setSharing] = useState(false);
  let watchId: number;

  useEffect(() => {
    orderService.getAvailableForLivreur().then((r) => setAvailable(r.data));
    orderService.getMyOrders().then((r) => setMyOrders(r.data));
  }, []);

  const toggleSharing = () => {
    if (!sharing) {
      connectSocket();
      watchId = navigator.geolocation.watchPosition((pos) => {
        emitLivreurPosition(pos.coords.latitude, pos.coords.longitude);
      });
      setSharing(true);
    } else {
      navigator.geolocation.clearWatch(watchId);
      setSharing(false);
    }
  };

  const assignOrder = async (id: string) => {
    await orderService.assignToMe(id);
    setAvailable((prev) => prev.filter((o) => o.idCommande !== id));
    const { data } = await orderService.getMyOrders();
    setMyOrders(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await orderService.updateStatus(id, status);
    setMyOrders((prev) =>
      prev.map((o) => o.idCommande === id ? { ...o, statusCommande: status as Commande['statusCommande'] } : o)
    );
  };

  const STATUS_NEXT: Record<string, string> = {
    ASSIGNED: 'PICKED_UP',
    PICKED_UP: 'IN_DELIVERY',
    IN_DELIVERY: 'DELIVERED',
  };

  const STATUS_LABEL: Record<string, string> = {
    ASSIGNED: 'Marquer collectée',
    PICKED_UP: 'Démarrer la livraison',
    IN_DELIVERY: 'Marquer livrée',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord Livreur</h1>
          <button
            onClick={toggleSharing}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sharing ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {sharing ? '📡 Partage actif' : '📍 Partager ma position'}
          </button>
        </div>

        {/* My orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Mes livraisons</h2>
            <Link to="/livreur/route" className="text-sm text-primary-600 hover:underline">
              Voir l'itinéraire optimisé →
            </Link>
          </div>
          {myOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune livraison assignée.</p>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div key={order.idCommande} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">#{order.idCommande.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{order.dropOffAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{order.livraisonPrice.toFixed(2)} DA</span>
                    {STATUS_NEXT[order.statusCommande] && (
                      <button
                        onClick={() => updateStatus(order.idCommande, STATUS_NEXT[order.statusCommande])}
                        className="text-xs bg-primary-600 text-white px-3 py-1 rounded-full hover:bg-primary-700 transition-colors"
                      >
                        {STATUS_LABEL[order.statusCommande]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Commandes disponibles</h2>
          {available.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune commande disponible.</p>
          ) : (
            <div className="space-y-3">
              {available.map((order) => (
                <div key={order.idCommande} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-700">#{order.idCommande.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">Collecte: {order.pickUpAddress}</p>
                    <p className="text-xs text-gray-400">Livraison: {order.dropOffAddress}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-green-600">{order.livraisonPrice.toFixed(2)} DA</p>
                    <button
                      onClick={() => assignOrder(order.idCommande)}
                      className="text-xs bg-accent-500 text-white px-3 py-1 rounded-full hover:bg-accent-600 transition-colors"
                    >
                      Accepter
                    </button>
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