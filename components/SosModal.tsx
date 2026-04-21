import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  ActivityIndicator, SafeAreaView, Alert, ScrollView
} from 'react-native';
import { ShieldAlert, X, MessageCircle, Check, AlertTriangle } from 'lucide-react-native';
import { sendSosSms, AccidentType } from '../utils/sosSms';
import { storage } from '../hooks/useEmergencyNumbers';

const ACCIDENT_TYPES: AccidentType[] = [
  'Road Accident',
  'Medical Emergency',
  'Fire',
  'Flooding',
  'Other',
];

// Emergency contacts for SOS — user can configure these
const DEFAULT_POLICE_CONTACTS = ['112', '100'];
const CUSTOM_CONTACTS_KEY = 'road_sos_custom_contacts';

type SosModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SosModal({ visible, onClose }: SosModalProps) {
  const [step, setStep] = useState<'select' | 'sending' | 'done' | 'error'>('select');
  const [selectedType, setSelectedType] = useState<AccidentType>('Road Accident');
  const [userName, setUserName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [customContacts, setCustomContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState('');

  useEffect(() => {
    try {
      const stored = storage.getString(CUSTOM_CONTACTS_KEY);
      if (stored) setCustomContacts(JSON.parse(stored));
    } catch { }
  }, []);

  const addContact = () => {
    if (!newContact.trim() || newContact.length < 3) return;
    const updated = [...customContacts, newContact.trim()];
    setCustomContacts(updated);
    storage.set(CUSTOM_CONTACTS_KEY, JSON.stringify(updated));
    setNewContact('');
  };

  const removeContact = (index: number) => {
    const updated = customContacts.filter((_, i) => i !== index);
    setCustomContacts(updated);
    storage.set(CUSTOM_CONTACTS_KEY, JSON.stringify(updated));
  };

  const handleSend = async () => {
    if (!userName.trim()) {
      Alert.alert('Name Required', 'Please enter your name so responders can identify you.');
      return;
    }
    setStep('sending');
    const recipients = [...DEFAULT_POLICE_CONTACTS, ...customContacts];
    const result = await sendSosSms(recipients, userName, selectedType);
    if (result.success) {
      setStep('done');
    } else {
      setErrorMsg(result.error ?? 'Unknown error');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('select');
    setUserName('');
    setSelectedType('Road Accident');
    setNewContact('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ShieldAlert size={24} color="#e11d48" />
            <Text style={styles.title}>Send SOS</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={24} color="#a1a1aa" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          {step === 'select' && (
            <>
              <Text style={styles.sectionLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name..."
                placeholderTextColor="#52525b"
                value={userName}
                onChangeText={setUserName}
              />

              <Text style={styles.sectionLabel}>Emergency Type</Text>
              <View style={styles.typeGrid}>
                {ACCIDENT_TYPES.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeBtn, selectedType === type && styles.typeBtnActive]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text style={[styles.typeBtnText, selectedType === type && styles.typeBtnTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionLabel}>Emergency Contacts</Text>
              <View style={styles.contactsBox}>
                <Text style={styles.policeInfo}>👮 Police (112, 100) will be notified automatically.</Text>
                {customContacts.map((c, i) => (
                  <View key={i} style={styles.contactChip}>
                    <Text style={styles.contactText}>{c}</Text>
                    <TouchableOpacity onPress={() => removeContact(i)}>
                      <X size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.addContactRow}>
                  <TextInput
                    style={styles.contactInput}
                    placeholder="Add student/family number..."
                    placeholderTextColor="#52525b"
                    keyboardType="phone-pad"
                    value={newContact}
                    onChangeText={setNewContact}
                  />
                  <TouchableOpacity style={styles.addContactBtn} onPress={addContact}>
                    <Text style={styles.addContactBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.previewBox}>
                <Text style={styles.previewTitle}>📋 SMS Preview</Text>
                <Text style={styles.previewText}>
                  🚨 EMERGENCY SOS — RoadSOS App{'\n'}
                  Name: {userName || '(your name)'}{'\n'}
                  Emergency: {selectedType}{'\n'}
                  📍 Location + GPS Link will be included
                </Text>
              </View>

              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <MessageCircle size={20} color="#fff" />
                <Text style={styles.sendBtnText}>Send SOS SMS Now</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'sending' && (
            <View style={styles.centeredState}>
              <ActivityIndicator size="large" color="#e11d48" />
              <Text style={styles.stateText}>Acquiring GPS and sending SOS...</Text>
              <Text style={styles.stateSubText}>Works even on 2G signal</Text>
            </View>
          )}

          {step === 'done' && (
            <View style={styles.centeredState}>
              <View style={styles.successCircle}>
                <Check size={48} color="#22c55e" />
              </View>
              <Text style={styles.stateText}>SOS Sent Successfully!</Text>
              <Text style={styles.stateSubText}>
                Your name, location, and emergency type have been sent.{'\n'}Call 112 if no response within 2 minutes.
              </Text>
              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'error' && (
            <View style={styles.centeredState}>
              <AlertTriangle size={48} color="#f59e0b" />
              <Text style={styles.stateText}>SMS Failed</Text>
              <Text style={styles.stateSubText}>{errorMsg}</Text>
              <TouchableOpacity style={styles.sendBtn} onPress={() => setStep('select')}>
                <Text style={styles.sendBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 4 },
  body: { padding: 20, paddingBottom: 40 },
  sectionLabel: { color: '#a1a1aa', fontSize: 13, fontWeight: '600', letterSpacing: 0.5, marginBottom: 10, marginTop: 20, textTransform: 'uppercase' },
  input: { backgroundColor: '#18181b', color: '#fff', fontSize: 16, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#18181b', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  typeBtnActive: { backgroundColor: 'rgba(225,29,72,0.15)', borderColor: '#e11d48' },
  typeBtnText: { color: '#a1a1aa', fontWeight: '600' },
  typeBtnTextActive: { color: '#e11d48' },
  previewBox: { backgroundColor: '#18181b', padding: 16, borderRadius: 12, marginTop: 24, borderLeftWidth: 3, borderLeftColor: '#e11d48' },
  previewTitle: { color: '#a1a1aa', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  previewText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#e11d48', paddingVertical: 18, borderRadius: 16, marginTop: 24 },
  sendBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  centeredState: { alignItems: 'center', paddingTop: 60, gap: 16 },
  successCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#22c55e' },
  stateText: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  stateSubText: { color: '#a1a1aa', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  doneBtn: { backgroundColor: '#27272a', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12, marginTop: 10 },
  doneBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  contactsBox: { backgroundColor: '#18181b', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  policeInfo: { color: '#fbbf24', fontSize: 13, marginBottom: 12, fontWeight: '600' },
  contactChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#27272a', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 8 },
  contactText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  addContactRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  contactInput: { flex: 1, backgroundColor: '#27272a', color: '#fff', fontSize: 14, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  addContactBtn: { backgroundColor: '#e11d48', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  addContactBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
