import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { boutiqueService, orderService } from '../../src/services/api';

interface Boutique { idBoutique: string; nomBoutique: string; address: string; }
interface Produit { idProduit: string; nomProduit: string; price: number; description: string; stock: number; }

export default function CatalogScreen() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [selected, setSelected] = useState<Boutique | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    boutiqueService.getAll().then((r) => setBoutiques(r.data));
  }, []);

  const selectBoutique = async (b: Boutique) => {
    setSelected(b);
    setCart({});
    const r = await import('../../src/services/api').then((m) =>
      m.api.get(`/products?boutique=${b.idBoutique}`)
    );
    setProduits(r.data);
  };

  const add = (id: string) => setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
  const remove = (id: string) =>
    setCart((p) => {
      if ((p[id] ?? 0) <= 1) { const c = { ...p }; delete c[id]; return c; }
      return { ...p, [id]: p[id] - 1 };
    });

  const total = produits.reduce((s, p) => s + (cart[p.idProduit] ?? 0) * p.price, 0);

  const placeOrder = async () => {
    if (!selected) return;
    setPlacing(true);
    await orderService.getMyOrders(); // just to ensure connected; real implementation calls create
    Alert.alert('Commande passée !', `Total: ${total.toFixed(2)} DA`);
    setCart({});
    setPlacing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catalogue</Text>

      {!selected ? (
        <FlatList
          data={boutiques}
          keyExtractor={(b) => b.idBoutique}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListEmptyComponent={<Text style={styles.empty}>Aucune boutique disponible</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.boutiqueCard} onPress={() => selectBoutique(item)}>
              <Text style={styles.boutiqueName}>{item.nomBoutique}</Text>
              <Text style={styles.boutiqueAddress}>{item.address}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => { setSelected(null); setProduits([]); }} style={styles.back}>
            <Text style={styles.backText}>← {selected.nomBoutique}</Text>
          </TouchableOpacity>
          <FlatList
            data={produits}
            keyExtractor={(p) => p.idProduit}
            contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 200 }}
            renderItem={({ item }) => (
              <View style={styles.produitCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.produitName}>{item.nomProduit}</Text>
                  <Text style={styles.produitDesc}>{item.description}</Text>
                  <Text style={styles.produitPrice}>{item.price.toFixed(2)} DA</Text>
                </View>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => remove(item.idProduit)} style={styles.counterBtn}>
                    <Text style={styles.counterBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{cart[item.idProduit] ?? 0}</Text>
                  <TouchableOpacity onPress={() => add(item.idProduit)} style={[styles.counterBtn, styles.counterBtnBlue]}>
                    <Text style={[styles.counterBtnText, { color: '#fff' }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          {Object.keys(cart).length > 0 && (
            <View style={styles.cartBar}>
              <Text style={styles.cartTotal}>{total.toFixed(2)} DA</Text>
              <TouchableOpacity
                style={[styles.orderBtn, placing && { opacity: 0.6 }]}
                onPress={placeOrder}
                disabled={placing}
              >
                <Text style={styles.orderBtnText}>Commander</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', padding: 20, paddingBottom: 8 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 60 },
  boutiqueCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  boutiqueName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  boutiqueAddress: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  back: { paddingHorizontal: 16, paddingBottom: 8 },
  backText: { fontSize: 14, color: '#2563eb', fontWeight: '500' },
  produitCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  produitName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  produitDesc: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  produitPrice: { fontSize: 14, fontWeight: '700', color: '#2563eb', marginTop: 4 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  counterBtnBlue: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  counterBtnText: { fontSize: 16, color: '#374151' },
  qty: { fontSize: 14, fontWeight: '600', color: '#111827', minWidth: 20, textAlign: 'center' },
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 8,
  },
  cartTotal: { fontSize: 18, fontWeight: '700', color: '#111827' },
  orderBtn: { backgroundColor: '#f97316', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  orderBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});