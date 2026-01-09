import { db } from "./config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from "./firestore";
import { getNextIncrementId } from "./hooks/getNextIncrementId";

const MAX_IDLE_HOURS = 6

export interface Session {
  id: string
  userId: string 
  checkIn: Timestamp
  checkOut: Timestamp | null
  duration: number | null
  createdAt: Timestamp
  isDeleted: boolean
  modifiedAt: Timestamp | null
}

export interface EnrichedSession extends Session {
  userName: string
}

export async function handleQRScan(userId: string) {
  const activeSession = await getActiveSession(userId)

  if (activeSession) {
    return await stopSession(activeSession)
  }

  return await startSession(userId)
}

export async function startSession(userId: string) {
  const nextId = await getNextIncrementId("session")

  // await setDoc(doc(db, "sessions", String(nextId)), {
  return await addDoc(collection(db, "sessions"), {
    fieldId: nextId,
    userId,
    checkIn: serverTimestamp(),
    checkOut: null,
    duration: null,
    createdAt: serverTimestamp(),
    importedAt: null,
    isDeleted: false,
    modifiedAt: null,
  })
}

export async function stopSession(session: Session) {
  const ref = doc(db, "sessions", session.id)

  const sessionStart = session.checkIn.toDate()
  const now = new Date()


  const duration =
    Math.round((now.getTime() - sessionStart.getTime()) / (60 * 1000)); // minutes

  // If the session is longer than MAX_IDLE_HOURS, cap the duration to one hour and start a new session

  let finalDuration = duration
  if (duration > MAX_IDLE_HOURS * 60) {
    finalDuration = 60

    await startSession(session.userId)
  }

  await updateDoc(ref, {
    checkOut: now,
    duration: finalDuration,
    modifiedAt: serverTimestamp(),
  })
}

export async function getActiveSession(userId: string): Promise<Session | null> {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    where("checkOut", "==", null)
  )

  const snap = await getDocs(q)

  if (snap.empty) return null

  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Session
}


export async function getSessionsByDate(date: Date): Promise<EnrichedSession[]> {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0) // next day at midnight
  
  const sessionsQuery = query(
    collection(db, "sessions"),
    where("checkIn", ">=", start),
    where("checkIn", "<", end)
  )
  
  const snapSessions = await getDocs(sessionsQuery);
  
  const sessions: EnrichedSession[] = []
  const userIds = new Set<number>()

  snapSessions.forEach((doc) => {
    userIds.add(Number(doc.data().userId))
    sessions.push({ id: doc.id, ...doc.data() } as EnrichedSession)
  })

  const usersIdsArray = Array.from(userIds)

  // If no users, return empty ranking
  if (!usersIdsArray.length) return [] 

  const usersQuery = query(
    collection(db, "users"),
    where("fieldId", "in", usersIdsArray)
  )

  const snapUsers = await getDocs(usersQuery)

  const userMap = new Map<number, string>()

  snapUsers.forEach((doc) => {
    const user = doc.data();
    userMap.set(doc.data().fieldId, user.name)
  })

  const enrichedSessions: EnrichedSession[] = sessions.map(session => {
    const userName = userMap.get(Number(session.userId)) || "Utilisateur inconnu";
    (session as EnrichedSession).userName = userName

    return session as EnrichedSession
  })

  
  return enrichedSessions
}