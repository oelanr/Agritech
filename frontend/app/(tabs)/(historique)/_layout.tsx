import { Stack } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

export default function HistoriqueLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="historique" // important : même nom que ton fichier
        options={{
          headerTitle: () => <CustomHeader />,
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
