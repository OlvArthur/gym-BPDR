import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SessionDetails() {
  const { id } = useLocalSearchParams(); // Get route param

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold">Session Details</Text>
      <Text className="mt-4 text-lg">Session ID: {id}</Text>
    </View>
  );
}
