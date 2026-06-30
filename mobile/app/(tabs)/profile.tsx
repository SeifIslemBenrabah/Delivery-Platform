import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (!user) return null;

  const fields = [
    { label: 'Prénom', value: user.firstName },
    { label: 'Nom', value: user.lastName },
    { label: 'Email', value: user.email },
    { label: 'Rôle', value: user.role },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.firstName[0]}{user.lastName[0]}
        </Text>
      </View>
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.role}>{user.role}</Text>

      <View style={styles.card}>
        {fields.map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f9fafb',
    alignItems: 'center', padding: 24, paddingTop: 48,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 12 },
  role: { fontSize: 13, color: '#6b7280', marginBottom: 24 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    width: '100%', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  label: { fontSize: 13, color: '#6b7280' },
  value: { fontSize: 13, fontWeight: '500', color: '#111827' },
  logoutBtn: {
    backgroundColor: '#fee2e2', borderRadius: 10,
    paddingVertical: 13, paddingHorizontal: 32,
  },
  logoutText: { color: '#dc2626', fontWeight: '600', fontSize: 15 },
});