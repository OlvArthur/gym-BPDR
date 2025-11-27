import { db } from "./config";
import {
    collection,
    getDocs,
    query,
    where
} from "./firestore";


export async function getUsers(): Promise<{ id: string; name: string; role: string }[]> {
    const usersCollection = collection(db, "users")
    const snapUsers = await getDocs(usersCollection)

    const users = snapUsers.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        role: doc.data().role,
    }))

    return users
}

export async function getUserById(userId: string): Promise<{ id: string; name: string; role: string } | null> {
    const userQuery = query(
        collection(db, "users"),
        where("__name__", "==", userId)
    )
    const userDoc = (await getDocs(userQuery)).docs[0]

    if (!userDoc) return null
    const userData = userDoc.data()

    return {
        id: userDoc.id,
        name: userData.name,
        role: userData.role,
    }
}

export async function getUserSessions(userId: string): Promise<{ checkIn: Date; checkOut: Date; duration: number }[]> {
    const sessionsQuery = query(
        collection(db, "sessions"),
        where("userId", "==", userId)
    )
    const snapSessions = await getDocs(sessionsQuery)

    const sessions = snapSessions.docs
        .map(doc => ({
            checkIn: doc.data().checkIn.toDate(),
            checkOut: doc.data().checkOut.toDate(),
            duration: doc.data().duration,
        }))

    return sessions
}