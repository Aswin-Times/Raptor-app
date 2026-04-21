import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { MapPin, Phone, Hospital, ShieldAlert } from 'lucide-react-native';
import * as Location from 'expo-location';
import { getNearbyFacilities, seedFacilities, Facility } from '../data/db/sqlite';

export default function FacilitiesScreen() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'all' | 'hospital' | 'police'>('all');
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    setLoading(true);
    setLocationError(null);
    try {
      await seedFacilities();
      
      let lat = 28.5659; // Default fallback to AIIMS Delhi
      let lon = 77.2093;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError("GPS permission denied. Showing mock data (New Delhi).");
      } else {
        const location = await Location.getCurrentPositionAsync({});
        lat = location.coords.latitude;
        lon = location.coords.longitude;
      }

      const results = await getNearbyFacilities(lat, lon, 20, type === 'all' ? undefined : type);
      setFacilities(results);
    } catch (e) {
      console.error(e);
      setLocationError("Failed to acquire GPS. Showing mock data (New Delhi).");
      const results = await getNearbyFacilities(28.5659, 77.2093, 20, type === 'all' ? undefined : type);
      setFacilities(results);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (num: string) => {
    Linking.openURL(`tel:${num}`);
  };

  const handleNavigate = (lat: number, lon: number) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Nearby Emergency Facilities</Text>
        <Text style={styles.subtitle}>Showing results within 20km (Offline GeoHash)</Text>

        {locationError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{locationError}</Text>
          </View>
        )}

        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterButton, type === 'all' && styles.filterActive]}
            onPress={() => setType('all')}
          >
            <Text style={[styles.filterText, type === 'all' && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, type === 'hospital' && styles.filterActive]}
            onPress={() => setType('hospital')}
          >
            <Hospital size={16} color={type === 'hospital' ? '#fff' : '#a1a1aa'} />
            <Text style={[styles.filterText, type === 'hospital' && styles.filterTextActive]}>Hospitals</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, type === 'police' && styles.filterActive]}
            onPress={() => setType('police')}
          >
            <ShieldAlert size={16} color={type === 'police' ? '#fff' : '#a1a1aa'} />
            <Text style={[styles.filterText, type === 'police' && styles.filterTextActive]}>Police</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#e11d48" />
          </View>
        ) : (
          <FlatList
            data={facilities}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>No facilities found nearby.</Text>}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  {item.type === 'hospital' ? <Hospital size={20} color="#e11d48" /> : <ShieldAlert size={20} color="#3b82f6" />}
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.distanceText}>{item.distance?.toFixed(1)} km</Text>
                </View>
                
                <Text style={styles.addressText}>{item.address}</Text>
                {item.trauma_level ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Trauma {item.trauma_level}</Text>
                  </View>
                ) : null}

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleNavigate(item.lat, item.lon)}>
                    <MapPin size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Navigate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={() => handleCall(item.phone)}>
                    <Phone size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#27272a' },
  filterActive: { backgroundColor: '#e11d48' },
  filterText: { color: '#a1a1aa', fontWeight: 'bold' },
  filterTextActive: { color: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 40 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardName: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold' },
  distanceText: { color: '#e11d48', fontSize: 14, fontWeight: 'bold' },
  addressText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 12 },
  badge: { alignSelf: 'flex-start', backgroundColor: 'rgba(225, 29, 72, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(225, 29, 72, 0.3)' },
  badgeText: { color: '#e11d48', fontSize: 10, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#27272a', paddingVertical: 10, borderRadius: 8 },
  callBtn: { backgroundColor: '#e11d48' },
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#a1a1aa', textAlign: 'center', marginTop: 40 },
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 10, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 13, textAlign: 'center', fontWeight: '600' }
});
