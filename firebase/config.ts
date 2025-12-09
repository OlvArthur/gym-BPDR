import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp } from 'firebase/app'
import { getReactNativePersistence, initializeAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { Platform } from 'react-native'

const firebaseConfig = {
  apiKey: "AIzaSyCfoFe4TrbMuBqJpXWCpSVBZ4_ZqfKCMzc",
  authDomain: "gym-bpdr.firebaseapp.com",
  projectId: "gym-bpdr",
  storageBucket: "gym-bpdr.firebasestorage.app",
  messagingSenderId: "101709513054",
  appId: "1:101709513054:web:2576e68d0925ef2403cfcf",
  measurementId: "G-H392GFFQPX"
}


const app = initializeApp(firebaseConfig)
// For more information on how to access Firebase,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase


export const db = getFirestore(app)


const auth = initializeAuth(app, {
  persistence: Platform.OS ==='web' ? undefined : getReactNativePersistence(ReactNativeAsyncStorage)
})
signInAnonymously(auth).catch((error) => {
  console.error("Firebase auth error:", error)
})