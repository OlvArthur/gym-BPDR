import { collection, documentId, getDocs, limit, orderBy, query } from "@firebase/firestore";

import { db } from "../config";

export async function getNextIncrementId(collectionName: string) {
  // Index necessary firestore: __name__ (descending)
  const q = query(
    collection(db, collectionName),
    orderBy(documentId(), "desc"),
    limit(1)
  )

  const snap = await getDocs(q)

  if (snap.empty) return 1 // first doc ever

  const highestId = parseInt(snap.docs[0].id, 10)
  return highestId + 1
}
