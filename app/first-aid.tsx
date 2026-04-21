import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, HeartPulse, Info, AlertTriangle } from 'lucide-react-native';
import { firstAidData, FirstAidTopic } from '../data/firstAidData';

export default function FirstAid() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const filteredTopics = firstAidData.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopic = firstAidData.find(t => t.id === selectedTopicId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!selectedTopic ? (
          <View style={styles.listContainer}>
            <Text style={styles.headerDesc}>
              Quick access to essential first aid instructions for common emergencies. In a severe medical emergency, always prioritize calling emergency services (112 / 911).
            </Text>

            <View style={styles.searchContainer}>
              <Search size={20} color="#a1a1aa" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search emergencies (e.g., Burns, CPR)..."
                placeholderTextColor="#a1a1aa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView contentContainerStyle={styles.topicsList}>
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <TouchableOpacity
                    key={topic.id}
                    style={styles.topicCard}
                    onPress={() => setSelectedTopicId(topic.id)}
                  >
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicDesc} numberOfLines={2}>{topic.shortDescription}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Info size={40} color="#a1a1aa" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText}>No topics found matching "{searchQuery}"</Text>
                </View>
              )}
            </ScrollView>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <HeartPulse size={24} color="#e11d48" />
              <Text style={styles.detailTitle}>{selectedTopic.title}</Text>
            </View>

            <Text style={styles.detailDesc}>{selectedTopic.shortDescription}</Text>

            <View style={styles.instructionsSection}>
              <Text style={styles.sectionTitle}>✓ What to do</Text>
              {selectedTopic.instructions.map((instruction, idx) => (
                <View key={idx} style={styles.instructionRow}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            {selectedTopic.warnings.length > 0 && (
              <View style={styles.warningsSection}>
                <View style={styles.warningHeader}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <Text style={styles.warningTitle}>Important Warnings</Text>
                </View>
                {selectedTopic.warnings.map((warning, idx) => (
                  <Text key={idx} style={styles.warningText}>• {warning}</Text>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setSelectedTopicId(null)}
            >
              <Text style={styles.backButtonText}>Back to Topics</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1, padding: 16 },
  listContainer: { flex: 1 },
  headerDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#27272a', borderRadius: 8, paddingHorizontal: 12, marginBottom: 20 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, color: '#fff' },
  topicsList: { paddingBottom: 20 },
  topicCard: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  topicTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  topicDesc: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { color: '#a1a1aa', fontSize: 16 },
  detailContainer: { paddingBottom: 40 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  detailDesc: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  instructionsSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  instructionRow: { flexDirection: 'row', marginBottom: 16, paddingRight: 20 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(225, 29, 72, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#e11d48' },
  stepText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  instructionText: { color: '#fff', fontSize: 15, lineHeight: 22, flex: 1 },
  warningsSection: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: 30 },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  warningTitle: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  warningText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 6, lineHeight: 20 },
  backButton: { backgroundColor: '#27272a', paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
