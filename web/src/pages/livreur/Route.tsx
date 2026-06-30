import { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import TrackingMap from '../../components/Map/TrackingMap';
import { optimizationService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface RouteStop {
  orderId: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery';
}

export default function LivreurRoute() {
  const { user } = useAuthStore();
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    optimizationService.getOptimizedRoute(user.userId).then((res) => {
      setStops(res.data.stops ?? []);
      setRouteCoords(res.data.polyline ?? []);
    }).finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Itinéraire optimisé</h1>
        <p className="text-sm text-gray-500">
          Trajet calculé par l'algorithme TSP pour minimiser la distance totale.
        </p>

        {loading ? (
          <p className="text-gray-400 text-sm">Calcul de l'itinéraire...</p>
        ) : (
          <>
            <TrackingMap routeCoords={routeCoords} />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-3">Ordre des arrêts</h2>
              {stops.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun arrêt planifié.</p>
              ) : (
                <ol className="space-y-3">
                  {stops.map((stop, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        stop.type === 'pickup' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{stop.address}</p>
                        <p className="text-xs text-gray-400">
                          {stop.type === 'pickup' ? '📦 Collecte' : '🏠 Livraison'} · #{stop.orderId.slice(0, 8)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}