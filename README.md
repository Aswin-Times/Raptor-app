# RoadSOS: Offline-First Indian Emergency Response App 🚑

RoadSOS is a production-ready React Native (Expo) mobile application designed to provide zero-latency, 100% offline emergency response tools for Indian roads. Built to work even in areas with no internet or 2G connections, RoadSOS ensures critical help and medical data are always accessible.

## 🚀 Key Features (Phase 1 Foundation)

1. **Offline Emergency Numbers Database**
   - Blazing fast search via `react-native-mmkv`.
   - Bundled with all Indian national emergency numbers (112, 108, 100) and state-specific contacts.
   - One-tap direct dial integration.

2. **Pre-Seeded Hospital & Police Database (Offline Geohash)**
   - Powered by `expo-sqlite` and pre-seeded with emergency facility data.
   - Uses a pure JavaScript Haversine formula to instantly calculate precise distances to nearby trauma centers and police stations entirely offline.

3. **Offline GPS + Reverse Geocoding**
   - Uses `expo-location` with satellite GPS (no internet required).
   - Bundled lightweight GeoJSON bounding box engine to resolve coordinates into human-readable State/District locations locally.

4. **One-Tap SMS SOS**
   - Bypasses data networks entirely by leveraging native SMS (`expo-sms`).
   - Automatically pre-fills an emergency message with the user's name, accident type, local timestamp, and a Google Maps GPS link.

5. **Bundled Offline First Aid Guide**
   - Complete first-aid database secured in `expo-sqlite`.
   - Uses SQLite FTS5 (Full-Text Search) for instantaneous, debounced searching.
   - Interactive UI with category chips (Cardiac, Trauma, Airway, etc.) and numbered step-by-step guidance.

6. **Offline Incident Recorder**
   - 120-second automated evidence capture sequence.
   - Silently captures 5 high-res photos (10s intervals), 60s of audio, and continuous GPS pings.
   - **Security**: AES-256 XOR encryption secures the manifest and metadata for untampered FIR and insurance claims.

7. **Emergency Medical ID**
   - Offline, encrypted storage for critical health data (Blood Type, Allergies, Medications, Organ Donor status).
   - Immediate access for first responders while the app is open, with instructions for native lock-screen syncing.

## 🛠️ Technology Stack

- **Framework**: React Native with Expo Router
- **Offline Storage**: `react-native-mmkv` (Key-Value) & `expo-sqlite` (Relational & FTS5)
- **Hardware Integrations**: `expo-location` (GPS), `expo-camera` (Photos), `expo-av` (Audio), `expo-sms` (Native messaging)
- **Security**: `expo-crypto` & `expo-file-system`
- **UI/Icons**: `lucide-react-native`

## 📦 Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aswin-Times/Raptor-app.git
   cd Raptor-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo server**
   ```bash
   npx expo start
   ```
   *Scan the QR code with the Expo Go app on your physical device to test hardware features like the camera, GPS, and SMS.*
