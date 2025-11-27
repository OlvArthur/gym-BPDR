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
  where,
} from "./firestore";

// COLLECTION: "sessions"
// FIELDS:
// userId, checkIn, checkOut, duration, createdAt, importedAt, isDeleted, modifiedAt

const MAX_IDLE_HOURS = 6

interface Session {
  id: string
  userId: string 
  checkIn: Timestamp
  checkOut: Timestamp | null
  duration: number | null
  createdAt: Timestamp
  isDeleted: boolean
  modifiedAt: Timestamp | null
}

export async function handleQRScan(userId: string) {
  const activeSession = await getActiveSession(userId)

  if (activeSession) {
    return await stopSession(activeSession)
  }

  return await startSession(userId)
}

export async function startSession(userId: string) {
  return await addDoc(collection(db, "sessions"), {
    userId,
    checkIn: serverTimestamp(),
    checkOut: null,
    duration: null,
    createdAt: serverTimestamp(),
    importedAt: null,
    isDeleted: false,
    modifiedAt: null,
  });
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
