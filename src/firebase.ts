import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, limit } from "firebase/firestore";
// Safely search for applet configuration using Vite glob.
// This prevents compilation failures on Vercel or local machine if the JSON file is gitignored.
const configs = (import.meta as any).glob("../firebase-applet-config.json", { eager: true });
const appletConfig: any = (Object.values(configs)[0] as any)?.default || {};

// Read environment variables (Vite-compatible) with fallback to generated applet configuration file
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || appletConfig.appId,
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId,
};

// Check if Firebase config is fully provided
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    // CRITICAL: Connect directly to the provisioned database ID
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase initialized successfully. Operating secure live cloud ledger.");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn(
    "Firebase environment variables are missing. Using LocalStorage fallback mechanism. To connect your live Firestore database, add VITE_FIREBASE_* environment variables."
  );
}

export { db, isFirebaseConfigured };

// Define a unified interface for our reviews
export interface Review {
  id?: string;
  productSlug: string;
  initials: string;
  city: string;
  rating: string; // "★★★★★" stars or converted from number
  desc: string;
  orderNo: string;
  createdAt?: any;
}

// Helper to convert number to stars
export function getStarsString(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// -------------------------------------------------------------
// SECURE ERROR HANDLING LAYER (Required by Firebase Skill Guide)
// -------------------------------------------------------------

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// Unified Review Database Access Layer (Firestore or LocalStorage Fallback)
// -------------------------------------------------------------

export async function fetchReviewsFromDb(productSlug: string): Promise<Review[]> {
  if (isFirebaseConfigured && db) {
    const path = "reviews";
    try {
      const q = query(
        collection(db, path),
        where("productSlug", "==", productSlug),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const reviewsList: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reviewsList.push({
          id: doc.id,
          productSlug: data.productSlug,
          initials: data.initials,
          city: data.city,
          rating: typeof data.rating === "number" ? getStarsString(data.rating) : data.rating,
          desc: data.desc,
          orderNo: data.orderNo,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      return reviewsList;
    } catch (error: any) {
      // If permission error, raise it with spec-compliant wrapper
      if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch (specError) {
          console.error("Firestore spec permission error logged:", specError);
        }
      }
      console.error("Firestore read error. Falling back to LocalStorage:", error);
      return fetchReviewsFromLocalStorage(productSlug);
    }
  } else {
    return fetchReviewsFromLocalStorage(productSlug);
  }
}

export async function addReviewToDb(review: Omit<Review, "id" | "createdAt" | "productSlug"> & { productSlug: string }): Promise<Review> {
  // Map stars to number format or string format
  const ratingNum = review.rating.match(/★/g)?.length || 5;

  if (isFirebaseConfigured && db) {
    const path = "reviews";
    try {
      const docRef = await addDoc(collection(db, path), {
        productSlug: review.productSlug,
        initials: review.initials,
        city: review.city,
        rating: ratingNum,
        desc: review.desc,
        orderNo: review.orderNo,
        createdAt: serverTimestamp(),
      });
      console.log("Written securely to Firestore backend ledger.", docRef.id);
      return {
        ...review,
        id: docRef.id,
        createdAt: new Date(),
      };
    } catch (error: any) {
      if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
        try {
          handleFirestoreError(error, OperationType.CREATE, path);
        } catch (specError) {
          console.error("Firestore spec permission error logged:", specError);
        }
      }
      console.error("Firestore write error. Falling back to LocalStorage:", error);
      return addReviewToLocalStorage(review);
    }
  } else {
    return addReviewToLocalStorage(review);
  }
}

// LocalStorage helpers
function fetchReviewsFromLocalStorage(productSlug: string): Review[] {
  const saved = localStorage.getItem(`reviews_${productSlug}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Map correctly to ensure all elements have a timestamp
      return parsed.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
    } catch (e) {
      console.error(e);
    }
  }

  // Pre-seed some beautiful, highly thematic initial reviews
  const defaultReviews: Review[] = [
    {
      productSlug: productSlug,
      initials: "K. HASHMI",
      city: "Karachi",
      rating: "★★★★★",
      desc: "My first pair of Oxfords from this atelier and I am completely blown away. The leather aroma, the precise unboxing presentation, and the snug fit are of international caliber. Wore them to an executive dinner and felt a class apart.",
      orderNo: "1 PAIR PURCHASED // ORDER #1042",
      createdAt: new Date("2026-05-15")
    },
    {
      productSlug: productSlug,
      initials: "Z. AHMED",
      city: "Lahore",
      rating: "★★★★★",
      desc: "Acquired this pair after visiting their Lahore workshop. The classic handwelted sole has a beautiful, rich resonance and feels wonderfully broken-in after just two wears.",
      orderNo: "1 PAIR PURCHASED // ORDER #2180",
      createdAt: new Date("2026-05-28")
    },
    {
      productSlug: productSlug,
      initials: "A. REHMAN",
      city: "Islamabad",
      rating: "★★★★★",
      desc: "Incredible attention to detail. From the heavy felted presentation box to the high-density cork bed cushioning. This is easily the most superior leather shoe in my wardrobe.",
      orderNo: "1 PAIR PURCHASED // ORDER #3095",
      createdAt: new Date("2026-06-01")
    }
  ];

  localStorage.setItem(`reviews_${productSlug}`, JSON.stringify(defaultReviews));
  return defaultReviews;
}

function addReviewToLocalStorage(review: Omit<Review, "id" | "createdAt">): Review {
  const existing = fetchReviewsFromLocalStorage(review.productSlug);
  const newReview: Review = {
    ...review,
    id: `local_${Date.now()}`,
    createdAt: new Date()
  };
  const updated = [newReview, ...existing];
  localStorage.setItem(`reviews_${review.productSlug}`, JSON.stringify(updated));
  return newReview;
}
