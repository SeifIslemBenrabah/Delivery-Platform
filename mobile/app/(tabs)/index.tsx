import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { orderService } from '../../src/services/api';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [orderCount, setOrderCount] = useState(0);
  const [inProgress, setInProgress] = useState(0);

  useEffect(() => {
    orderService.getMyOrders().then((r) => {
      setOrderCount(r.data.length);
      setInProgress(
        r.data.filter((o: { statusCommande: string }) =>
          ['CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_DELIVERY'].includes(o.statusCommande)
        ).length
      );
    }).catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.firstName} 👋</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
          <Text style={[styles.statValue, { color: '#2563eb' }]}>{orderCount}</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fff7ed' }]}>
          <Text style={[styles.statValue, { color: '#ea580c' }]}>{inProgress}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actions}>
        {user?.role === 'CLIENT' && (
          <>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.actionIcon}>🛒</Text>
              <Text style={styles.actionLabel}>Commander</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/orders')}>
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionLabel}>Mes commandes</Text>
            </TouchableOpacity>
          </>
        )}
        {user?.role === 'LIVREUR' && (
          <>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/orders')}>
              <Text style={styles.actionIcon}>🚴</Text>
              <Text style={styles.actionLabel}>Mes livraisons</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionLabel}>Itinéraire</Text>
            </TouchableOpacity>
          </>
        )}
        {user?.role === 'COMMERCANT' && (
          <>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/orders')}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>Commandes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/boutique')}>
              <Text style={styles.actionIcon}>🏪</Text>
              <Text style={styles.actionLabel}>Ma boutique</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  header: { marginTop: 16, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#111827' },
  role: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
  },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '500', color: '#374151', textAlign: 'center' },
});