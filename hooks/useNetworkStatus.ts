import NetInfo from "@react-native-community/netinfo"
import { useEffect, useState } from "react"

export function useNetworkStatus() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null)
    const [ssid, setSsid] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected)

            if(state.type === "wifi") {
                setSsid(state.details?.ssid || null)
            } else {
                setSsid(null)
            }
        })

        return () => unsubscribe()
    }, [])

    return { isConnected, ssid }
}