import { db } from "./config"
import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    limit,
    orderBy,
    query,
    where
} from "./firestore"
import { Session } from "./sessionService"


export type UserSession = Pick<Session, 'id' | 'checkIn' | 'checkOut' | 'duration'>  
export interface User {
    id: string
    name: string
    role: string
}

export async function createUser(name: string, role: string, fieldId: number): Promise<void> {
    const userData = {
        name,
        role,
        fieldId,
        active: true,
        createdAt: new Date(),
        modifiedAt: null
    }

    await addDoc(collection(db,"users"), userData)
}

export async function deleteUserById(userId: number): Promise<void> {
    const userQuery = query(
        collection(db, "users"),
        where("fieldId", "==", userId),
        limit(1)
    )
    const userDoc = (await getDocs(userQuery)).docs[0]

    if ( !userDoc ) throw new Error("User not found")

    await deleteDoc(userDoc.ref)
}

export async function getUsers(): Promise<User[]> {
    const usersCollection = collection(db, "users")
    const snapUsers = await getDocs(usersCollection)

    const users = snapUsers.docs.map((doc) => ({
        id: doc.data().fieldId,
        name: doc.data().name,
        role: doc.data().role,
    }))

    return users
}

export async function getUserById(userId: string): Promise<User | null> {
    const userQuery = query(
        collection(db, "users"),
        where("fieldId", "==", Number(userId)),
        limit(1)
    )
    const userDoc = (await getDocs(userQuery)).docs[0]

    if (!userDoc) return null
    const userData = userDoc.data()

    return {
        id: userData.fieldId,
        name: userData.name,
        role: userData.role,
    }
}

export async function getUserSessions(userId: string): Promise<UserSession[]> {
    
    // Index necessary firestore: userID (ascending) checkIn (descending) __name__(descending)
    const sessionsQuery = query(
        collection(db, "sessions"),
        where("userId", "==", userId),
        orderBy('checkIn', 'desc')
    ) 

    const snapSessions = await getDocs(sessionsQuery)

    const sessions = snapSessions.docs.reduce((result, doc) => {
        if(Number(doc.data().duration) < 60 * 6) {
            result.push({
              id: doc.id,
              checkIn: doc.data().checkIn,
              checkOut: doc.data().checkOut,
              duration: doc.data().duration,
            })
        }

        return result
    }, [] as UserSession[])
        

    return sessions
}