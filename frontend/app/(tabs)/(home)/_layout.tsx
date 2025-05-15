import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Accueil' }}
      />
      <Stack.Screen
        name="details"
        options={{ title: 'Détails' }}
      />
    </Stack>
  );
}
