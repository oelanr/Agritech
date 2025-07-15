import { Stack } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

export default function ProfilLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <CustomHeader />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#FFF',
          },
        }}
      />
    </Stack>
  );
}
