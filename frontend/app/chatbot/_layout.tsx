import { Stack } from 'expo-router';

export default function ChatbotLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Assistant Diagnostic' }} />
    </Stack>
  );
}
