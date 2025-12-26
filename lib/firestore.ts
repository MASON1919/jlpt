// Firebase/Firestore configuration for problem statistics
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Firebase configuration - uses environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Types for statistics
export type ProblemType = "VOCAB" | "GRAMMAR" | "READING" | "LISTENING";
export type ProblemSubType =
  | "KANJI_READING"
  | "ORTHOGRAPHY"
  | "WORD_FORMATION"
  | "CONTEXT"
  | "PARAPHRASE"
  | "USAGE"
  | "GRAMMAR_FORM"
  | "GRAMMAR_ORDER"
  | "TEXT_GRAMMAR"
  | "SHORT_PASSAGE"
  | "MID_PASSAGE"
  | "LONG_PASSAGE"
  | "INTEGRATED_PASSAGE"
  | "THEMATIC_PASSAGE"
  | "INFO_RETRIEVAL"
  | "TASK_BASED"
  | "POINT_COMPREHENSION"
  | "SUMMARY"
  | "QUICK_RESPONSE"
  | "INTEGRATED_COMPREHENSION";

export interface StatCount {
  correct: number;
  total: number;
}

export interface LevelStats {
  problemType: Record<ProblemType, StatCount>;
  problemSubType: Record<string, StatCount>;
  lastUpdated: Timestamp | null;
}

export interface UserStats {
  [level: string]: LevelStats;
}

// Default stats structure for a new level
const createDefaultLevelStats = (): LevelStats => ({
  problemType: {
    VOCAB: { correct: 0, total: 0 },
    GRAMMAR: { correct: 0, total: 0 },
    READING: { correct: 0, total: 0 },
    LISTENING: { correct: 0, total: 0 },
  },
  problemSubType: {},
  lastUpdated: null,
});

export async function updateProblemStats(
  userId: string,
  level: number,
  problemType: ProblemType,
  problemSubType: ProblemSubType,
  isCorrect: boolean
): Promise<void> {
  const statsRef = doc(db, "users", userId, "stats", String(level));

  try {
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      // Create new stats document with initial values
      const newStats = createDefaultLevelStats();
      newStats.problemType[problemType] = { correct: isCorrect ? 1 : 0, total: 1 };
      newStats.problemSubType[problemSubType] = { correct: isCorrect ? 1 : 0, total: 1 };
      newStats.lastUpdated = Timestamp.now();

      await setDoc(statsRef, newStats);
    } else {
      // Update existing stats
      const updates: Record<string, unknown> = {
        [`problemType.${problemType}.total`]: increment(1),
        [`problemSubType.${problemSubType}.total`]: increment(1),
        lastUpdated: serverTimestamp(),
      };

      if (isCorrect) {
        updates[`problemType.${problemType}.correct`] = increment(1);
        updates[`problemSubType.${problemSubType}.correct`] = increment(1);
      }

      // Ensure subtype exists before incrementing
      const data = statsDoc.data() as LevelStats;
      if (!data.problemSubType?.[problemSubType]) {
        updates[`problemSubType.${problemSubType}`] = {
          correct: isCorrect ? 1 : 0,
          total: 1,
        };
        // Remove increment updates for this subtype since we're setting it directly
        delete updates[`problemSubType.${problemSubType}.total`];
        if (isCorrect) {
          delete updates[`problemSubType.${problemSubType}.correct`];
        }
      }

      await updateDoc(statsRef, updates);
    }
  } catch (error) {
    console.error("Error updating problem stats:", error);
    throw error;
  }
}

/**
 * Get all statistics for a user
 * @param userId - User's unique identifier
 * @returns Object containing stats for all levels
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const stats: UserStats = {};
  const levels = [1, 2, 3, 4, 5];

  try {
    for (const level of levels) {
      const statsRef = doc(db, "users", userId, "stats", String(level));
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        stats[String(level)] = statsDoc.data() as LevelStats;
      }
    }

    return stats;
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
}

/**
 * Get statistics for a specific level
 * @param userId - User's unique identifier
 * @param level - JLPT level (1-5)
 * @returns Stats for the specified level or null if not found
 */
export async function getLevelStats(
  userId: string,
  level: number
): Promise<LevelStats | null> {
  try {
    const statsRef = doc(db, "users", userId, "stats", String(level));
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      return statsDoc.data() as LevelStats;
    }

    return null;
  } catch (error) {
    console.error("Error getting level stats:", error);
    throw error;
  }
}