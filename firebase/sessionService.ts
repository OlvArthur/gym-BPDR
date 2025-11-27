import { db } from "./config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "./firestore";

// COLLECTION: "sessions"
// FIELDS:
// userId, checkIn, checkOut, duration, createdAt, importedAt, isDeleted, modifiedAt

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

export async function stopSession(sessionId: string) {
  const ref = doc(db, "sessions", sessionId);

  const end = new Date();

  // Fetch session to compute duration
  const snap = await getDocs(
    query(
      collection(db, "sessions"),
      where("__name__", "==", sessionId)
    )
  );

  if (snap.empty) return;

  const data = snap.docs[0].data() as any;
  const start = data.startTime.toDate();

  const duration =
    Math.round((end.getTime() - start.getTime()) / (60 * 1000)); // minutes

  await updateDoc(ref, {
    checkOut: end,
    duration,
  });
}

export async function getActiveSession(userId: string) {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    where("checkOut", "==", null)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}
