import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuthStore } from '../../src/store/authStore';
import { optimizationService } from '../../src/services/api';
import { io } from 'socket.io-client';

// Re-export optimizationService for mobile
const { getOptimizedRoute } = optimizationService ?? {};

interface Stop {
  orderId: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery';
}

export default function MapScreen() {
  const { user } = useAuthStore();
  const mapRef = useRef<MapView>(null);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [sharing, setSharing] = useState(false);
  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const socket = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setMyLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();

    if (user) {
      getOptimizedRoute?.(user.userId).then((res: { data: { stops?: Stop[]; polyline?: [number, number][] } }) => {
        setStops(res.data.stops ?? []);
        setRouteCoords(
          (res.data.polyline ?? []).map(([latitude, longitude]) => ({ latitude, longitude }))
        );
      }).catch(() => {});
    }
  }, [user]);

  const toggleSharing = async () => {
    if (!sharing) {
      const WS_URL = 'ws://10.0.2.2/ws';
      socket.current = io(WS_URL, { transports: ['websocket'] });
      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          socket.current?.emit('livreur:position', {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
          setMyLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        }
      );
      setSharing(true);
    } else {
      locationSub.current?.remove();
      socket.current?.disconnect();
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: myLocation?.lat ?? 36.7538,
          longitude: myLocation?.lng ?? 3.0588,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {stops.map((stop, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: stop.lat, longitude: stop.lng }}
            title={`${i + 1}. ${stop.type === 'pickup' ? 'Collecte' : 'Livraison'}`}
            description={stop.address}
            pinColor={stop.type === 'pickup' ? '#2563eb' : '#16a34a'}
          />
        ))}
        {routeCoords.length > 1 && (
          <Polyline coordinates={routeCoords} strokeColor="#2563eb" strokeWidth={3} />
        )}
      </MapView>

      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.btn, sharing && styles.btnActive]}
          onPress={toggleSharing}
        >
          <Text style={styles.btnText}>
            {sharing ? '📡 Partage actif — Arrêter' : '📍 Partager ma position'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.stopsInfo}>{stops.length} arrêts planifiés</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnActive: { backgroundColor: '#dc2626' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  stopsInfo: { textAlign: 'center', fontSize: 12, color: '#6b7280', marginTop: 8 },
});