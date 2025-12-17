import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const { authReady } = useAuth();
  
  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initialisation...</Text>
      </View>
    );
  }

  return <Redirect href="./user" />;
}

