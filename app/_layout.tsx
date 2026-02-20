import OfflineBanner from "@/components/OfflineBanner"
import OfflineModal from "@/components/OfflineModal"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

import * as Sentry from '@sentry/react-native'
import { Stack } from "expo-router"
import { ActivityIndicator, View } from "react-native"


Sentry.init({
  dsn: "https://51f6983441fbd25a4788dde1be5cf2b2@o4510782309990400.ingest.us.sentry.io/4510782329651200",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
})

function RootLayout() {
  const { authReady } = useAuth()

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <OfflineBanner />
      <OfflineModal />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        />
    </>
  )
}

export default Sentry.wrap(function Layout() {
    return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  )
})