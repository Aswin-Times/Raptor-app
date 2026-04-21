import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, ActivityIndicator
} from 'react-native';
import * as Icons from 'lucide-react-native';
import { Search, Info, AlertTriangle, ChevronLeft, Zap } from 'lucide-react-native';
import Animated, { withRepeat, withTiming, useSharedValue, useAnimatedStyle, withSequence, Easing } from 'react-native-reanimated';
import { useFirstAidSearch, ParsedTopic } from '../hooks/useFirstAidSearch';

const DynamicIcon = ({ name, color, size, style }: any) => {
  const IconComponent = (Icons as any)[name] || Icons.HeartPulse;
  return <IconComponent color={color} size={size} style={style} />;
};

const CATEGORIES = [
  { key: undefined,       label: 'All' },
  { key: 'cardiac',       label: '❤️ Cardiac' },
  { key: 'trauma',        label: '🩹 Trauma' },
  { key: 'airway',        label: '💨 Airway' },
  { key: 'neurological',  label: '🧠 Neuro' },
  { key: 'environmental', label: '🌡️ Env' },
  { key: 'toxicology',    label: '☠️ Tox' },
  { key: 'circulation',   label: '🔴 Circ' },
];

export default function FirstAid() {
  const { topics, isLoading, query, setQuery, category, setCategory } = useFirstAidSearch();
  const [selectedTopic, setSelectedTopic] = useState<ParsedTopic | null>(null);

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerBanner}>
          <Zap size={16} color="#e11d48" />
          <Text style={styles.headerBannerText}>
            Offline · FTS5 Powered · {topics.length} Topics
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#a1a1aa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search: CPR, burns, choking…"
            placeholderTextColor="#52525b"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={String(cat.key)}
              style={[styles.chip, category === cat.key && styles.chipActive]}
              onPress={() => setCategory(cat.key)}
            >
              <Text style={[styles.chipText, category === cat.key && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results */}
        {isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#e11d48" />
            <Text style={styles.loaderText}>Searching database...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {topics.length === 0 ? (
              <View style={styles.emptyState}>
                <Info size={40} color="#3f3f46" />
                <Text style={styles.emptyText}>No results for "{query}"</Text>
                <Text style={styles.emptySubText}>Try a different keyword or clear filters</Text>
              </View>
            ) : (
              topics.map(topic => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicCard}
                  onPress={() => setSelectedTopic(topic)}
                  activeOpacity={0.7}
                >
                  <View style={styles.topicCardInner}>
                    <DynamicIcon name={topic.icon} size={20} color="#e11d48" style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicDesc} numberOfLines={2}>
                        {topic.shortDescription}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{topic.category}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
}

// ─── Detail View ─────────────────────────────────────────────────────────────

function TopicDetail({ topic, onBack }: { topic: ParsedTopic; onBack: () => void }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.detailContainer}>

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={20} color="#a1a1aa" />
          <Text style={styles.backBtnText}>All Topics</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.detailHeader}>
          <Animated.View style={[styles.detailIconWrap, animatedStyle]}>
             <DynamicIcon name={topic.icon} size={28} color="#e11d48" />
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{topic.title}</Text>
            <Text style={styles.detailCategory}>{topic.category.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.detailDesc}>{topic.shortDescription}</Text>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ What To Do</Text>
          {topic.instructions.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepBubble}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Warnings */}
        {topic.warnings.length > 0 && (
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={18} color="#ef4444" />
              <Text style={styles.warningTitle}>⚠️ Critical Warnings</Text>
            </View>
            {topic.warnings.map((w, i) => (
              <Text key={i} style={styles.warningText}>• {w}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={18} color="#fff" />
          <Text style={styles.backButtonText}>Back to Topics</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1, paddingTop: 12 },

  headerBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  headerBannerText: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181b', marginHorizontal: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 12, gap: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  clearBtn: { color: '#52525b', fontSize: 16, fontWeight: 'bold' },

  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#18181b', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  chipActive: { backgroundColor: 'rgba(225,29,72,0.15)', borderColor: '#e11d48' },
  chipText: { color: '#71717a', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#e11d48' },

  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loaderText: { color: '#a1a1aa', fontSize: 14 },

  list: { paddingHorizontal: 16, paddingBottom: 40 },
  topicCard: { backgroundColor: '#18181b', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  topicCardInner: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  topicTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  topicDesc: { color: '#71717a', fontSize: 13, lineHeight: 18 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  categoryBadgeText: { color: '#52525b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptySubText: { color: '#52525b', fontSize: 13 },

  // Detail
  detailContainer: { padding: 20, paddingBottom: 50 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  backBtnText: { color: '#a1a1aa', fontSize: 14 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  detailIconWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(225,29,72,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(225,29,72,0.3)' },
  detailTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1 },
  detailCategory: { color: '#e11d48', fontSize: 11, fontWeight: '700', marginTop: 4 },
  detailDesc: { color: '#a1a1aa', fontSize: 15, lineHeight: 22, marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },

  section: { marginBottom: 28 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 16 },
  stepRow: { flexDirection: 'row', marginBottom: 14, gap: 12 },
  stepBubble: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(225,29,72,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e11d48', flexShrink: 0, marginTop: 1 },
  stepNum: { color: '#e11d48', fontSize: 11, fontWeight: 'bold' },
  stepText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 21, flex: 1 },

  warningBox: { backgroundColor: 'rgba(239,68,68,0.08)', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', marginBottom: 28 },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  warningTitle: { color: '#ef4444', fontSize: 15, fontWeight: 'bold' },
  warningText: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 8, lineHeight: 20 },

  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#27272a', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  backButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
