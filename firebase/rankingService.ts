import { db } from "./config";
import {
  collection,
  getDocs,
  query,
  where,
} from "./firestore";

export interface RankingSession {
  userId: string;
  userName: string;
  duration: number;
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

  const sessionsQuery = query(
    collection(db, "sessions"),
    where("checkIn", ">=", start),
    where("checkIn", "<", end)
  );

  const snapSessions = await getDocs(sessionsQuery);

  const totals = new Map<string, number>();
  const userIds = new Set<string>();

  snapSessions.forEach((doc) => {
    const session = doc.data();
    if (!session.duration || !(session.checkOut)) return;

    userIds.add(session.userId);
    
    totals.set(session.userId, (Number(totals.get(session.userId)) || 0) + Number(session.duration));
  });

  const usersIdsArray = Array.from(userIds);

  // If no users, return empty ranking
  if (!usersIdsArray.length) return []; 

  const usersQuery = query(
    collection(db, "users"),
    where("__name__", "in", usersIdsArray)
  )

  const snapUsers = await getDocs(usersQuery);

  const userMap = new Map<string, string>();

  snapUsers.forEach((doc) => {
    const user = doc.data();
    userMap.set(doc.id, user.name);
  })

  const sortedSessions = Array.from(totals.entries())
    .map(([userId, duration]) => ({
      userId,
      userName: userMap.get(String(userId)) || "Inconnu",
      duration: Number(duration),
    }))
    .sort((a, b) => b.duration - a.duration)

    return sortedSessions


  }

