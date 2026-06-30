import { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { orderService } from '../../services/api';
import type { Commande } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    orderService.getAll().then((r) => setOrders(r.data));
  }, []);

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.statusCommande === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Toutes les commandes</h1>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s} {s !== 'ALL' && `(${orders.filter((o) => o.statusCommande === s).length})`}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Livraison à</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr key={o.idCommande} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o.idCommande.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-48 truncate">{o.dropOffAddress}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{o.totalPrice.toFixed(2)} DA</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {o.statusCommande}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">Aucune commande</p>
          )}
        </div>
      </main>
    </div>
  );
}