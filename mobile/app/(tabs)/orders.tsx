import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { orderService } from '../../src/services/api';

interface Order {
  idCommande: string;
  date: string;
  dropOffAddress: string;
  statusCommande: string;
  totalPrice: number;
  livraisonPrice: number;
  pickUpAddress: string;
}

const STATUS_NEXT: Record<string, string> = {
  ASSIGNED: 'PICKED_UP',
  PICKED_UP: 'IN_DELIVERY',
  IN_DELIVERY: 'DELIVERED',
};

const STATUS_LABEL_NEXT: Record<string, string> = {
  ASSIGNED: 'Collectée ✓',
  PICKED_UP: 'En livraison ✓',
  IN_DELIVERY: 'Livrée ✓',
};

export default function OrdersScreen() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [available, setAvailable] = useState<Order[]>([]);
  const [tab, setTab] = useState<'mine' | 'available'>('mine');

  const isLivreur = user?.role === 'LIVREUR';

  const load = () => {
    orderService.getMyOrders().then((r) => setOrders(r.data));
    if (isLivreur) {
      orderService.getAvailableForLivreur().then((r) => setAvailable(r.data));
    }
  };

  useEffect(() => { load(); }, []);

  const acceptOrder = async (id: string) => {
    await orderService.assignToMe(id);
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await orderService.updateStatus(id, status);
    load();
  };

  const data = tab === 'mine' ? orders : available;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLivreur ? 'Livraisons' : 'Mes commandes'}</Text>

      {isLivreur && (
        <View style={styles.tabs}>
          {(['mine', 'available'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'mine' ? 'Mes livraisons' : 'Disponibles'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={(item) => item.idCommande}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucune commande</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>#{item.idCommande.slice(0, 8)}</Text>
              <Text style={styles.status}>{item.statusCommande}</Text>
            </View>
            <Text style={styles.address}>{item.dropOffAddress}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString('fr-FR')}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>
                {isLivreur && tab === 'available'
                  ? `${item.livraisonPrice?.toFixed(2)} DA`
                  : `${item.totalPrice?.toFixed(2)} DA`
                }
              </Text>
              {tab === 'available' ? (
                <TouchableOpacity
                  style={styles.btnAccept}
                  onPress={() => acceptOrder(item.idCommande)}
                >
                  <Text style={styles.btnText}>Accepter</Text>
                </TouchableOpacity>
              ) : STATUS_NEXT[item.statusCommande] ? (
                <TouchableOpacity
                  style={styles.btnStatus}
                  onPress={() => updateStatus(item.idCommande, STATUS_NEXT[item.statusCommande])}
                >
                  <Text style={styles.btnText}>{STATUS_LABEL_NEXT[item.statusCommande]}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', padding: 20, paddingBottom: 12 },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  tabBtn: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff',
  },
  tabBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  tabText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  tabTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderId: { fontSize: 14, fontWeight: '600', color: '#111827' },
  status: { fontSize: 12, color: '#2563eb', fontWeight: '500' },
  address: { fontSize: 13, color: '#6b7280' },
  date: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  price: { fontSize: 15, fontWeight: '700', color: '#16a34a' },
  btnAccept: { backgroundColor: '#f97316', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  btnStatus: { backgroundColor: '#2563eb', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 15 },
});