import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Phone } from 'lucide-react-native';
import { useState } from 'react';

export default function EmergencyChat() {
  const { incidentId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', text: 'I am Raptor AI. I understand you have an emergency. How can I help?' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), role: 'user', text: message }]);
    setMessage('');
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: 'I am processing your request. Please stay calm and safe.' }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Incident #{incidentId === 'new' ? '10293' : incidentId}</Text>
          <TouchableOpacity style={styles.callButton}>
            <Phone size={18} color="#fff" />
            <Text style={styles.callButtonText}>112</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 16 }}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput 
            style={styles.input} 
            placeholder="Type your emergency..." 
            placeholderTextColor="#a1a1aa"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  callButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e11d48', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  callButtonText: { color: '#fff', fontWeight: 'bold' },
  chatArea: { flex: 1 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#e11d48' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#27272a' },
  messageText: { color: '#fff', fontSize: 15, lineHeight: 20 },
  inputArea: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', alignItems: 'center', gap: 10 },
  input: { flex: 1, backgroundColor: '#27272a', borderRadius: 24, paddingHorizontal: 16, height: 48, color: '#fff' },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e11d48', alignItems: 'center', justifyContent: 'center' }
});
