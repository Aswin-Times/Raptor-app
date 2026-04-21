import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivitySquare as Activity, Heart, Info, Save, ChevronLeft } from 'lucide-react-native';
import { useMedicalId, MedicalIdProfile } from '../hooks/useMedicalId';
import { useRouter } from 'expo-router';

export default function MedicalIdScreen() {
  const { profile, isLoaded, saveProfile } = useMedicalId();
  const [form, setForm] = useState<MedicalIdProfile>(profile);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) setForm(profile);
  }, [isLoaded, profile]);

  const handleSave = () => {
    if (saveProfile(form)) {
      Alert.alert('Saved', 'Medical ID saved offline successfully.');
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={{color: '#fff'}}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Heart size={24} color="#e11d48" />
          <Text style={styles.headerTitle}>Medical ID</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Save size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.infoBanner}>
            <Info size={20} color="#3b82f6" style={{ marginTop: 2 }} />
            <Text style={styles.infoBannerText}>
              For true Lock Screen access without unlocking your phone, you must also add this info in your OS settings (Android: Emergency Info, iOS: Health App > Medical ID). This local copy helps first responders if the app is open.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="John Doe" placeholderTextColor="#52525b" />
            
            <Text style={styles.label}>Blood Type</Text>
            <TextInput style={styles.input} value={form.bloodType} onChangeText={(t) => setForm({ ...form, bloodType: t })} placeholder="O+, A-, etc." placeholderTextColor="#52525b" />
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Organ Donor</Text>
              <Switch value={form.organDonor} onValueChange={(v) => setForm({ ...form, organDonor: v })} trackColor={{ false: '#3f3f46', true: '#e11d48' }} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Allergies & Reactions</Text>
            <TextInput style={styles.inputMultiline} value={form.allergies} onChangeText={(t) => setForm({ ...form, allergies: t })} multiline placeholder="Penicillin, Peanuts..." placeholderTextColor="#52525b" />
            
            <Text style={styles.label}>Medications</Text>
            <TextInput style={styles.inputMultiline} value={form.medications} onChangeText={(t) => setForm({ ...form, medications: t })} multiline placeholder="Insulin, Inhaler..." placeholderTextColor="#52525b" />
            
            <Text style={styles.label}>Medical Conditions</Text>
            <TextInput style={styles.inputMultiline} value={form.medicalConditions} onChangeText={(t) => setForm({ ...form, medicalConditions: t })} multiline placeholder="Asthma, Type 1 Diabetes..." placeholderTextColor="#52525b" />
          </View>

          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Contact Name</Text>
            <TextInput style={styles.input} value={form.emergencyContactName} onChangeText={(t) => setForm({ ...form, emergencyContactName: t })} placeholder="Jane Doe" placeholderTextColor="#52525b" />
            
            <Text style={styles.label}>Relationship</Text>
            <TextInput style={styles.input} value={form.emergencyContactRelation} onChangeText={(t) => setForm({ ...form, emergencyContactRelation: t })} placeholder="Spouse, Parent..." placeholderTextColor="#52525b" />
            
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={form.emergencyContactPhone} onChangeText={(t) => setForm({ ...form, emergencyContactPhone: t })} placeholder="+1 234 567 8900" keyboardType="phone-pad" placeholderTextColor="#52525b" />
          </View>

          <Text style={styles.sectionTitle}>Primary Doctor</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Doctor's Name</Text>
            <TextInput style={styles.input} value={form.doctorName} onChangeText={(t) => setForm({ ...form, doctorName: t })} placeholder="Dr. Smith" placeholderTextColor="#52525b" />
            
            <Text style={styles.label}>Doctor's Phone</Text>
            <TextInput style={styles.input} value={form.doctorPhone} onChangeText={(t) => setForm({ ...form, doctorPhone: t })} placeholder="+1 234 567 8900" keyboardType="phone-pad" placeholderTextColor="#52525b" />
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  backBtn: { marginRight: 16, padding: 4 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  saveBtn: { padding: 10, backgroundColor: '#e11d48', borderRadius: 10 },
  container: { padding: 16 },
  infoBanner: { flexDirection: 'row', backgroundColor: 'rgba(59,130,246,0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', marginBottom: 24, gap: 12 },
  infoBannerText: { color: 'rgba(255,255,255,0.85)', flex: 1, fontSize: 13, lineHeight: 20 },
  sectionTitle: { color: '#a1a1aa', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginLeft: 4, letterSpacing: 0.5 },
  card: { backgroundColor: '#18181b', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  label: { color: '#71717a', fontSize: 12, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: '#09090b', color: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16, fontSize: 15 },
  inputMultiline: { backgroundColor: '#09090b', color: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16, minHeight: 100, textAlignVertical: 'top', fontSize: 15 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingVertical: 8 },
  switchLabel: { color: '#fff', fontSize: 15, fontWeight: '500' },
});
