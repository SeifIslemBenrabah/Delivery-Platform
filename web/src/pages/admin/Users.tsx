import { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { userService } from '../../services/api';
import type { Livreur, Commercant } from '../../types';

type Tab = 'livreurs' | 'commercants';

export default function AdminUsers() {
  const [tab, setTab] = useState<Tab>('livreurs');
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [commercants, setCommerçants] = useState<Commercant[]>([]);

  useEffect(() => {
    userService.getLivreurs().then((r) => setLivreurs(r.data));
    userService.getCommerçants().then((r) => setCommerçants(r.data));
  }, []);

  const data = tab === 'livreurs' ? livreurs : commercants;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>

        <div className="flex gap-2">
          {(['livreurs', 'commercants'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === 'livreurs' ? 'Livreurs' : 'Commerçants'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Téléphone</th>
                {tab === 'livreurs' && <th className="px-4 py-3 text-left">Note</th>}
                {tab === 'livreurs' && <th className="px-4 py-3 text-left">Disponible</th>}
                {tab === 'commercants' && <th className="px-4 py-3 text-left">Type</th>}
                {tab === 'commercants' && <th className="px-4 py-3 text-left">Revenu</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-700">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                  {tab === 'livreurs' && (
                    <>
                      <td className="px-4 py-3">⭐ {(u as Livreur).rating?.toFixed(1)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          (u as Livreur).availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {(u as Livreur).availability ? 'Disponible' : 'Indisponible'}
                        </span>
                      </td>
                    </>
                  )}
                  {tab === 'commercants' && (
                    <>
                      <td className="px-4 py-3 text-gray-500">{(u as Commercant).type}</td>
                      <td className="px-4 py-3 font-medium text-green-600">{(u as Commercant).revenuTotal?.toFixed(2)} DA</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">Aucun utilisateur</p>
          )}
        </div>
      </main>
    </div>
  );
}