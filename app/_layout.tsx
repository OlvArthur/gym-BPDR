import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function RootLayout() {
  const { authReady } = useAuth();

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
}

export default function Layout() {
    return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
