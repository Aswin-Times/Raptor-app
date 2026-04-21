import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="first-aid" options={{ headerShown: true, title: 'First Aid' }} />
        <Stack.Screen name="emergency-numbers" options={{ headerShown: true, title: 'Emergency Numbers', presentation: 'modal' }} />
        <Stack.Screen name="facilities" options={{ headerShown: true, title: 'Hospitals & Police' }} />
        <Stack.Screen name="incident-recorder" options={{ headerShown: true, title: 'Incident Recorder' }} />
        <Stack.Screen name="medical-id" options={{ headerShown: true, title: 'Medical ID' }} />
        <Stack.Screen name="emergency/[incidentId]" options={{ headerShown: true, title: 'Emergency Chat' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
