import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../src/services/api';

type Role = 'CLIENT' | 'LIVREUR' | 'COMMERCANT';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', address: '', password: '', role: 'CLIENT' as Role,
  });
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleRegister = async () => {
    setLoading(true);
    try {
      await authService.register(form);
      Alert.alert('Succès', 'Compte créé. Connectez-vous.');
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('Erreur', "Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Créer un compte</Text>

        {[
          { key: 'firstName', label: 'Prénom' },
          { key: 'lastName', label: 'Nom' },
          { key: 'email', label: 'Email', keyboard: 'email-address' as const },
          { key: 'phone', label: 'Téléphone', keyboard: 'phone-pad' as const },
          { key: 'address', label: 'Adresse' },
          { key: 'password', label: 'Mot de passe', secure: true },
        ].map(({ key, label, keyboard, secure }) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={label}
            value={form[key as keyof typeof form]}
            onChangeText={(v) => update(key as keyof typeof form, v)}
            keyboardType={keyboard}
            secureTextEntry={secure}
            autoCapitalize="none"
            placeholderTextColor="#9ca3af"
          />
        ))}

        {/* Role selector */}
        <Text style={styles.label}>Rôle</Text>
        <View style={styles.roleRow}>
          {(['CLIENT', 'LIVREUR', 'COMMERCANT'] as Role[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleBtn, form.role === r && styles.roleBtnActive]}
              onPress={() => update('role', r)}
            >
              <Text style={[styles.roleBtnText, form.role === r && styles.roleBtnTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  roleBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roleBtnText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  roleBtnTextActive: {
    color: '#2563eb',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  link: { textAlign: 'center', color: '#2563eb', fontSize: 13 },
});