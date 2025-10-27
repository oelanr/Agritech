import AsyncStorage from '@react-native-async-storage/async-storage';

export const getOrCreateUserId = async () => {
  let userId = await AsyncStorage.getItem("user_id");
  if (!userId) {
    userId = "user-" + Math.random().toString(36).substring(2, 10);
    await AsyncStorage.setItem("user_id", userId);
  }
  return userId;
};
