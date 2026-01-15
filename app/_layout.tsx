import { setVisibilityAsync } from 'expo-navigation-bar';

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { useEffect } from 'react';
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
  useEffect(() => {
      setVisibilityAsync('hidden')
    }, [])

    return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
