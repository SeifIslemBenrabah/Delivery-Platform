import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import TrackingMap from '../../components/Map/TrackingMap';
import { useOrderStore } from '../../store/orderStore';
import { connectSocket, subscribeToOrderTracking } from '../../services/socket';

const STEPS = ['CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_DELIVERY', 'DELIVERED'] as const;

export default function ClientTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder, fetchOrder } = useOrderStore();
  const [livreurPos, setLivreurPos] = useState<{ lat: number; lng: number } | undefined>();
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId, fetchOrder]);

  useEffect(() => {
    if (!orderId) return;
    connectSocket();
    const unsub = subscribeToOrderTracking(
      orderId,
      (pos) => setLivreurPos({ lat: pos.lat, lng: pos.lng }),
      (s) => setStatus(s)
    );
    return unsub;
  }, [orderId]);

  const currentStep = status || currentOrder?.statusCommande || 'CONFIRMED';
  const stepIndex = STEPS.indexOf(currentStep as typeof STEPS[number]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Suivi de commande</h1>
        {currentOrder && (
          <p className="text-sm text-gray-500">
            Commande #{currentOrder.idCommande.slice(0, 8)} · {currentOrder.dropOffAddress}
          </p>
        )}

        {/* Status stepper */}
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                i <= stepIndex
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 transition-colors ${i < stepIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 -mt-1">
          {STEPS.map((s) => <span key={s}>{s}</span>)}
        </div>

        {/* Map */}
        <TrackingMap livreurPosition={livreurPos} />

        {/* ETA */}
        {livreurPos && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700">Position du livreur mise à jour en temps réel</p>
            <p className="text-xs text-gray-400 mt-1">
              {livreurPos.lat.toFixed(5)}, {livreurPos.lng.toFixed(5)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}