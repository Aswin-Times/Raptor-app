import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, ShieldAlert, Zap, MessageCircle, Phone, MapPin, ChevronRight, Navigation } from 'lucide-react-native';
import { useState } from 'react';
import { useOfflineLocation } from '../hooks/useOfflineLocation';
import SosModal from '../components/SosModal';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const { address } = useOfflineLocation();

  const handleGetHelpNow = async () => {
    // Navigate to emergency chat
    router.push('/emergency/new');
  };

  const handleSos = () => {
    setShowSosModal(true);
  };

  const features = [
    {
      icon: MessageCircle,
      title: "AI Triage Assessment",
      desc: "Real-time injury assessment with CRITICAL, SERIOUS, and MINOR classifications",
    },
    {
      icon: Zap,
      title: "First Aid Guidance",
      desc: "Step-by-step emergency first aid instructions tailored to reported injuries",
      link: "/first-aid",
    },
    {
      icon: Phone,
      title: "Dispatch Coordination",
      desc: "Instant access to emergency services with location-based contact recommendations",
      link: "/emergency-numbers",
    },
    {
      icon: MapPin,
      title: "Hospital Locator",
      desc: "Instantly locate the nearest hospitals and health centers based on your current location",
      link: "/facilities",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Navigation */}
        <View style={styles.nav}>
          <View style={styles.logoContainer}>
            <AlertCircle size={28} color="#e11d48" />
            <Text style={styles.logoText}>RAPTOR AI</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Zap size={14} color="#e11d48" />
            <Text style={styles.badgeText}>Real-time Emergency Response</Text>
          </View>

          <View style={styles.locationBadge}>
            <Navigation size={14} color="#3b82f6" />
            <Text style={styles.locationText}>{address}</Text>
          </View>

          <Text style={styles.title}>
            Your AI Emergency <Text style={styles.titleHighlight}>Co-Pilot</Text>
          </Text>

          <Text style={styles.subtitle}>
            RAPTOR AI guides you through road accidents with expert triage, real-time first aid instructions, and instant emergency dispatch coordination. Every second counts.
          </Text>

          {/* SOS Button */}
          <View style={styles.sosContainer}>
            <TouchableOpacity style={styles.sosButton} onPress={handleSos} activeOpacity={0.8}>
              <ShieldAlert size={60} color="#fff" />
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>TAP FOR EMERGENCY</Text>
            </TouchableOpacity>
          </View>

          {/* AI Assistant CTA */}
          <TouchableOpacity 
            style={styles.aiButton} 
            onPress={handleGetHelpNow}
            disabled={isLoading}
          >
            <Text style={styles.aiButtonText}>
              {isLoading ? "Starting..." : "Talk to AI Assistant"}
            </Text>
            {!isLoading && <ChevronRight size={20} color="#fff" />}
          </TouchableOpacity>

          {/* Emergency Numbers */}
          <View style={styles.emergencyNumbers}>
            {[
              { num: "112", label: "Universal" },
              { num: "108", label: "Ambulance" },
              { num: "100", label: "Police" },
            ].map(({ num, label }) => (
              <TouchableOpacity 
                key={num} 
                style={styles.numberCard}
                onPress={() => Linking.openURL(`tel:${num}`)}
              >
                <Text style={styles.numberText}>{num}</Text>
                <Text style={styles.numberLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Advanced Emergency Response</Text>
          <Text style={styles.featuresSubtitle}>Powered by Gemma 4 AI, designed for real-world emergencies</Text>

          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <TouchableOpacity 
                key={idx} 
                style={styles.featureCard}
                disabled={!feature.link}
                onPress={() => {
                  if (feature.link) {
                    if (feature.link.startsWith('http')) {
                      Linking.openURL(feature.link);
                    } else {
                      router.push(feature.link as any);
                    }
                  }
                }}
              >
                <View style={styles.featureIconContainer}>
                  <Icon size={24} color="#e11d48" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>RAPTOR AI — AI-Powered Emergency Response System</Text>
          <Text style={styles.footerSubtext}>Always call 112 in life-threatening emergencies</Text>
        </View>
      </ScrollView>
      <SosModal visible={showSosModal} onClose={() => setShowSosModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
    marginBottom: 24,
  },
  badgeText: {
    color: '#e11d48',
    fontSize: 12,
    fontWeight: '600',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 24,
  },
  locationText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleHighlight: {
    color: '#e11d48',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  sosContainer: {
    marginBottom: 40,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: 'rgba(225, 29, 72, 0.3)',
    elevation: 10,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  sosText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 8,
  },
  sosSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 4,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27272a',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
    marginBottom: 40,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emergencyNumbers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  numberCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: 90,
  },
  numberText: {
    color: '#e11d48',
    fontSize: 24,
    fontWeight: 'bold',
  },
  numberLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 4,
  },
  features: {
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(225, 29, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  footerSubtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 4,
  },
});
