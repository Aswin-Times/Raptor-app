import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Phone, Search, MapPin } from 'lucide-react-native';
import { useEmergencyNumbers } from '../hooks/useEmergencyNumbers';
import { EmergencyNumber } from '../data/emergencyNumbers';

export default function EmergencyNumbersScreen() {
  const { numbers, isLoading } = useEmergencyNumbers();
  const [search, setSearch] = useState('');

  const handleCall = (num: string) => {
    Linking.openURL(`tel:${num}`);
  };

  const filteredNumbers = numbers.filter(n => 
    n.name.toLowerCase().includes(search.toLowerCase()) || 
    (n.state && n.state.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Phone size={24} color="#e11d48" />
          <Text style={styles.headerTitle}>Offline Emergency Numbers</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#a1a1aa" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by state or service..."
            placeholderTextColor="#a1a1aa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {filteredNumbers.map((item: EmergencyNumber) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                {item.state && (
                  <View style={styles.stateBadge}>
                    <MapPin size={12} color="#a1a1aa" />
                    <Text style={styles.stateText}>{item.state}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => handleCall(item.number)}
              >
                <Phone size={18} color="#fff" />
                <Text style={styles.callText}>{item.number}</Text>
              </TouchableOpacity>
            </View>
          ))}
          {filteredNumbers.length === 0 && (
            <Text style={styles.emptyText}>No numbers found offline.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#27272a', paddingHorizontal: 12, borderRadius: 8, marginBottom: 20 },
  searchInput: { flex: 1, height: 48, color: '#fff', marginLeft: 10 },
  list: { paddingBottom: 40 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardInfo: { flex: 1, marginRight: 10 },
  cardName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  stateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stateText: { color: '#a1a1aa', fontSize: 12 },
  callButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e11d48', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  callText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#a1a1aa', textAlign: 'center', marginTop: 40 }
});
