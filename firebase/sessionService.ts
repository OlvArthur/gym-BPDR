import { db } from "./config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from "./firestore";
import { getNextIncrementId } from "./hooks/getNextIncrementId";

const MAX_IDLE_HOURS = 6
const MINUTE_MS = 60_000

export interface Session {
  id: string
  fieldId: number
  userId: number 
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

type ResultMessage = (userName: string) => string

const minutesBetween = (later: number, earlier: number) => Math.floor((later - earlier) / MINUTE_MS)
const firstName = (fullName: string) => fullName.split(" ")[0]

export async function handleUserSessionTrigger(userId: number): Promise<ResultMessage> {
  const activeSession = await getActiveSession(userId)


  if(!activeSession) {
    await startSession(userId)
    return (userName) => ` QR code scanné\n Bon entraînement, ${firstName(userName)}!`
  }

  // Scenario: Someone started a session and forgot to clock out and the next day (in fact after 6 hours) wants to start a new session  
  // Solution: the old session is closed with a duration of half an hour and a new session is started
  const nowMs = Date.now() 
  const sessionStartMs = activeSession.checkIn.toDate().getTime()
  const activeSessionDuration = minutesBetween(nowMs, sessionStartMs)

  const idleLimitMinutes = MAX_IDLE_HOURS * 60
  const isIdleTooLong = activeSessionDuration > idleLimitMinutes

  if(isIdleTooLong) {
    await stopSession(activeSession, 30)
    await startSession(userId)

    return (userName) => ` QR code scanné\n Votre précédente session a été clôturée automatiquement\n après ${MAX_IDLE_HOURS} heures d'inactivité.\n Bon entraînement, ${firstName(userName)}!`
  }

  await stopSession(activeSession, activeSessionDuration)
  return (userName) => ` QR code scanné\n À bientôt, ${firstName(userName)}!`
}

export async function startSession(userId: number) {
  const nextId = await getNextIncrementId("sessions")

  const sessionData = {
    fieldId: nextId,
    userId,
    checkIn: serverTimestamp(),
    checkOut: null,
    duration: null,
    createdAt: serverTimestamp(),
    importedAt: null,
    isDeleted: false,
    modifiedAt: null,
  }

  await addDoc(collection(db, "sessions"), sessionData )
}

export async function stopSession(session: Session, sessionDuration: number) {
  const ref = doc(db, "sessions", session.id)

  const now = new Date()

  await updateDoc(ref, {
    checkOut: now,
    duration: sessionDuration,
    modifiedAt: serverTimestamp(),
  })
}

export async function getActiveSession(userId: number): Promise<Session | null> {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    where("checkOut", "==", null),
    limit(1)
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
  
  const snapSessions = await getDocs(sessionsQuery)
  
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
    const user = doc.data()
    userMap.set(doc.data().fieldId, user.name)
  })

  const enrichedSessions: EnrichedSession[] = sessions.map(session => {
    const userName = userMap.get(Number(session.userId)) || "Utilisateur inconnu";
    (session as EnrichedSession).userName = userName

    return session as EnrichedSession
  })

  
  return enrichedSessions
}