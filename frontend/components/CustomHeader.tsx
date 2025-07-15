import { View, Text, Image, StyleSheet } from 'react-native';

export default function CustomHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image
          source={require('../assets/images/U.png')}
          style={styles.icon}
        />
      </View>
      <Text style={styles.text}>Salanitra, User</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop:18,
    paddingBottom:10,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 20,
  },
});
