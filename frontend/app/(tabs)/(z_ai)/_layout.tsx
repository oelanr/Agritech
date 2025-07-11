import { Stack } from 'expo-router';

export default function AILayout() {
  return (
    <Stack
      screenOptions={{
        title: 'AI',
        headerShown: false,
      }}
    />
  );
}