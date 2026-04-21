import { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, Linking, Alert
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  Video as VideoIcon, Mic, MapPin, Lock, CheckCircle,
  AlertTriangle, FileText, RefreshCcw, Camera
} from 'lucide-react-native';
import { useIncidentRecorder } from '../hooks/useIncidentRecorder';

export default function IncidentRecorderScreen() {
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { state, start, reset } = useIncidentRecorder(cameraRef);

  const { phase, photosTaken, audioSeconds, gpsCount, incidentId, errorMsg, exportPath } = state;

  const handleOpen = () => {
    if (exportPath) Linking.openURL(exportPath);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.infoText}>Checking camera permissions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Camera size={48} color="#e11d48" />
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.infoText}>
            The Incident Recorder needs camera and microphone access to capture evidence.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Live Camera Preview */}
        <View style={styles.cameraWrap}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={'back' as CameraType}
          />
          {phase === 'capturing_photos' && (
            <View style={styles.cameraOverlay}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>AUTO-CAPTURE {photosTaken}/{5}</Text>
            </View>
          )}
          {phase === 'recording_audio' && (
            <View style={styles.cameraOverlay}>
              <Mic size={20} color="#fff" />
              <Text style={styles.recText}>RECORDING {audioSeconds}s / 60s</Text>
            </View>
          )}
        </View>

        {/* Status Cards */}
        <View style={styles.statsRow}>
          <StatCard icon={<Camera size={18} color={photosTaken > 0 ? '#22c55e' : '#52525b'} />}
            label="Photos" value={`${photosTaken}/5`} active={photosTaken > 0} />
          <StatCard icon={<Mic size={18} color={audioSeconds > 0 ? '#3b82f6' : '#52525b'} />}
            label="Audio" value={`${audioSeconds}s`} active={audioSeconds > 0} />
          <StatCard icon={<MapPin size={18} color={gpsCount > 0 ? '#f59e0b' : '#52525b'} />}
            label="GPS Pings" value={`${gpsCount}`} active={gpsCount > 0} />
        </View>

        {/* Phase Banner */}
        <PhaseBanner phase={phase} errorMsg={errorMsg} />

        {/* Description */}
        {phase === 'idle' && (
          <View style={styles.descBox}>
            <Lock size={16} color="#a1a1aa" />
            <Text style={styles.descText}>
              Starts a 2-minute automated evidence capture:{'\n'}
              • 5 photos, 10s apart{'\n'}
              • 60s audio recording{'\n'}
              • GPS log every 30s{'\n'}
              • All encrypted with AES-256 + exportable for FIR/insurance
            </Text>
          </View>
        )}

        {/* Export Info */}
        {phase === 'done' && exportPath && (
          <View style={styles.exportBox}>
            <FileText size={20} color="#22c55e" />
            <View style={{ flex: 1 }}>
              <Text style={styles.exportTitle}>Evidence Package Ready</Text>
              <Text style={styles.exportId}>ID: {incidentId?.slice(0, 8)}…</Text>
              <Text style={styles.exportPath}>{exportPath}</Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        {(phase === 'idle' || phase === 'error') && (
          <TouchableOpacity
            style={[styles.primaryBtn, phase === 'error' && styles.warningBtn]}
            onPress={phase === 'error' ? reset : start}
          >
            {phase === 'error' ? (
              <>
                <RefreshCcw size={20} color="#fff" />
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </>
            ) : (
              <>
                <VideoIcon size={20} color="#fff" />
                <Text style={styles.primaryBtnText}>Start Incident Recording</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {phase === 'done' && (
          <View style={styles.doneActions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={reset}>
              <RefreshCcw size={18} color="#fff" />
              <Text style={styles.secondaryBtnText}>New Recording</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active phase — show progress info but no button */}
        {['requesting_permissions', 'capturing_photos', 'recording_audio', 'encrypting'].includes(phase) && (
          <View style={styles.activeNote}>
            <Text style={styles.activeNoteText}>
              ⏳ Recording in progress — keep the app open and pointed at the scene
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, active }: { icon: any; label: string; value: string; active: boolean }) {
  return (
    <View style={[styles.statCard, active && styles.statCardActive]}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const PHASE_CONFIG: Record<string, { color: string; icon: any; text: string }> = {
  idle:                  { color: '#52525b', icon: null,          text: 'Ready to record' },
  requesting_permissions:{ color: '#f59e0b', icon: null,          text: 'Requesting permissions…' },
  capturing_photos:      { color: '#3b82f6', icon: null,          text: 'Auto-capturing photos…' },
  recording_audio:       { color: '#e11d48', icon: null,          text: 'Recording 60s audio…' },
  encrypting:            { color: '#a855f7', icon: null,          text: 'Encrypting evidence…' },
  done:                  { color: '#22c55e', icon: <CheckCircle size={16} color="#22c55e" />, text: 'Evidence secured ✓' },
  error:                 { color: '#ef4444', icon: <AlertTriangle size={16} color="#ef4444" />, text: 'Recording failed' },
};

function PhaseBanner({ phase, errorMsg }: { phase: string; errorMsg: string | null }) {
  const cfg = PHASE_CONFIG[phase] ?? PHASE_CONFIG.idle;
  return (
    <View style={[styles.phaseBanner, { borderColor: cfg.color + '44', backgroundColor: cfg.color + '15' }]}>
      {cfg.icon}
      <Text style={[styles.phaseText, { color: cfg.color }]}>
        {phase === 'error' && errorMsg ? errorMsg : cfg.text}
      </Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea:   { flex: 1, backgroundColor: '#09090b' },
  container:  { padding: 16, paddingBottom: 40 },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },

  cameraWrap: { borderRadius: 16, overflow: 'hidden', height: 260, backgroundColor: '#18181b', marginBottom: 16, position: 'relative' },
  camera:     { flex: 1 },
  cameraOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  recDot:     { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e11d48' },
  recText:    { color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },

  statsRow:   { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard:   { flex: 1, backgroundColor: '#18181b', borderRadius: 12, alignItems: 'center', padding: 14, gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  statCardActive: { borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' },
  statValue:  { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  statLabel:  { color: '#52525b', fontSize: 11, textTransform: 'uppercase', fontWeight: '600' },

  phaseBanner:{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  phaseText:  { fontWeight: '700', fontSize: 14 },

  descBox:    { flexDirection: 'row', gap: 12, backgroundColor: '#18181b', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  descText:   { color: '#a1a1aa', fontSize: 13, lineHeight: 22, flex: 1 },

  exportBox:  { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(34,197,94,0.08)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)', marginBottom: 20 },
  exportTitle:{ color: '#22c55e', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  exportId:   { color: '#a1a1aa', fontSize: 12, marginBottom: 2 },
  exportPath: { color: '#52525b', fontSize: 11, flexWrap: 'wrap' },

  primaryBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#e11d48', paddingVertical: 16, borderRadius: 16 },
  warningBtn:   { backgroundColor: '#78350f' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  doneActions: { gap: 10 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#27272a', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  secondaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  activeNote: { backgroundColor: '#18181b', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginTop: 16 },
  activeNoteText: { color: '#a1a1aa', fontSize: 13, textAlign: 'center', lineHeight: 20 },

  title:    { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  infoText: { color: '#a1a1aa', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
