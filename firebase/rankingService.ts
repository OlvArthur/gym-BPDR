import { chunkArray } from "@/hooks/chunkArray"
import { db } from "./config"
import {
  collection,
  getDocs,
  query,
  where,
} from "./firestore"

export interface RankingSession {
  userId: number
  userName: string
  duration: number
  formattedDuration: string
}

export async function getDailyRanking(date: Date): Promise<RankingSession[]> {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0) // next day at midnight

  const sessionRankingByDay = await getSessionRankingByPeriod(start, end)

  return sessionRankingByDay
}

export async function getMonthlyRanking(month: number, year: number): Promise<RankingSession[]> {
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 1, 0, 0, 0); // first day of next month

  const sessionRankingByMonth = await getSessionRankingByPeriod(start, end);

  return sessionRankingByMonth
}

export async function getYearlyRanking(year: number): Promise<RankingSession[]> {
  const start = new Date(year, 0, 1, 0, 0, 0);
  const end = new Date(year + 1, 0, 1, 0, 0, 0); // first day of next year

  const sessionRankingByYear = await getSessionRankingByPeriod(start, end);

  return sessionRankingByYear;
}

async function getSessionRankingByPeriod(start: Date, end: Date): Promise<RankingSession[]> {

  // index on sessions (checkIn, checkout, duration, __name__)
  const sessionsQuery = query(
    collection(db, "sessions"),
    where("checkIn", ">=", start),
    where("checkIn", "<", end),
    where("checkOut", "!=", null),
    where("duration", "<", 60 * 6), // Exclude idle session from old app with more than 6 hours.
  )
  
  const snapSessions = await getDocs(sessionsQuery)

  const totals = new Map<number, number>();
  const userIds = new Set<number>();

  snapSessions.forEach((doc) => {
    const session = doc.data();
    const sessionUserId = Number(session.userId)

    if(session.userId) userIds.add(sessionUserId)
    
    totals.set(
      sessionUserId,
      (Number(totals.get(sessionUserId)) || 0) + Number(session.duration)
    )
  })

  const usersIdsArray = Array.from(userIds)

  // If no users, return empty ranking
  if (!usersIdsArray.length) return []; 

  // Firestore has a maximum of 30 ids to query
  
  const userMap = new Map<number, string>();
  const userIdsbatches = chunkArray(usersIdsArray)

  for (const batch of userIdsbatches) {
    const usersQuery = query(
      collection(db, "users"),
      where("fieldId", "in", batch)
    )

    const snapUsers = await getDocs(usersQuery)

    snapUsers.forEach((doc) => {
      const user = doc.data();
      userMap.set(doc.data().fieldId, user.name);
    })
    
  }

  const sortedSessions = Array.from(totals.entries())
    .map(([userId, duration]) => ({
      userId,
      userName: userMap.get(Number((userId))) || "Inconnu",
      duration: Number(duration),
      formattedDuration: `${Math.floor(Number(duration) / 60)} heures ${Number(duration) % 60} minutes`,
    }))
    .sort((a, b) => b.duration - a.duration)

    snapSessions.docs.length = 0

    return sortedSessions
  }

