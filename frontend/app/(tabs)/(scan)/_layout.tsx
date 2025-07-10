import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack
      screenOptions={{
        title: 'Scan',
        headerShown: false,
      }}
    />
  );
}