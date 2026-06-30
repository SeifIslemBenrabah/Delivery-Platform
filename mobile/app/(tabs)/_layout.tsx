import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';

export default function TabLayout() {
  const { user } = useAuthStore();
  const role = user?.role ?? 'CLIENT';

  const clientTabs = [
    { name: 'index', title: 'Accueil', icon: 'home' },
    { name: 'orders', title: 'Commandes', icon: 'receipt' },
    { name: 'catalog', title: 'Catalogue', icon: 'grid' },
    { name: 'profile', title: 'Profil', icon: 'person' },
  ];

  const livreurTabs = [
    { name: 'index', title: 'Tableau de bord', icon: 'speedometer' },
    { name: 'orders', title: 'Livraisons', icon: 'bicycle' },
    { name: 'map', title: 'Carte', icon: 'map' },
    { name: 'profile', title: 'Profil', icon: 'person' },
  ];

  const commercantTabs = [
    { name: 'index', title: 'Dashboard', icon: 'stats-chart' },
    { name: 'orders', title: 'Commandes', icon: 'receipt' },
    { name: 'boutique', title: 'Boutique', icon: 'storefront' },
    { name: 'profile', title: 'Profil', icon: 'person' },
  ];

  const tabs =
    role === 'LIVREUR' ? livreurTabs :
    role === 'COMMERCANT' ? commercantTabs :
    clientTabs;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#f3f4f6' },
        tabBarIcon: ({ color, size }) => {
          const tab = tabs.find((t) => t.name === route.name);
          return (
            <Ionicons
              name={(tab?.icon ?? 'ellipse') as Parameters<typeof Ionicons>[0]['name']}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        />
      ))}
    </Tabs>
  );
}