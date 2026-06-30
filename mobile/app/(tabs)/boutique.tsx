import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { boutiqueService } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';

interface Boutique { idBoutique: string; nomBoutique: string; address: string; idCommercant: string; }

export default function BoutiqueScreen() {
  const { user } = useAuthStore();
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [nom, setNom] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    boutiqueService.getAll().then((r) => {
      const mine = r.data.find((b: Boutique) => b.idCommercant === user?.userId);
      if (mine) { setBoutique(mine); setNom(mine.nomBoutique); setAddress(mine.address); }
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('nomBoutique', nom);
    fd.append('address', address);
    if (boutique) {
      await boutiqueService.update(boutique.idBoutique, fd as unknown as FormData);
      Alert.alert('Succès', 'Boutique mise à jour.');
    } else {
      await boutiqueService.create(fd as unknown as FormData);
      Alert.alert('Succès', 'Boutique créée.');
    }
    setSaving(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ma boutique</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nom de la boutique</Text>
        <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom" placeholderTextColor="#9ca3af" />
        <Text style={styles.label}>Adresse</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Adresse" placeholderTextColor="#9ca3af" />
        <TouchableOpacity
          style={[styles.btn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.btnText}>{saving ? 'Enregistrement...' : boutique ? 'Mettre à jour' : 'Créer la boutique'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  label: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827', marginBottom: 14,
  },
  btn: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});