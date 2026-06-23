import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, limit, updateDoc, doc, onSnapshot } from "firebase/firestore";
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
    // CRITICAL: Connect directly to the provisioned database ID safely
    db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);
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

    const fetchPromise = (async () => {
      const q = query(
        collection(db, path),
        where("productSlug", "==", productSlug),
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

      // Sort in-memory descending by createdAt
      reviewsList.sort((a, b) => {
        const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return tB - tA;
      });
      return reviewsList;
    })();

    // 3 seconds timeout
    let timeoutId: any;
    const timeoutPromise = new Promise<Review[]>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Firestore review load timed out (3000ms)"));
      }, 3000);
    });

    try {
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch (specError) {
          console.error("Firestore spec permission error logged:", specError);
        }
      }
      console.warn("Firestore read error or query timed out. Falling back to LocalStorage:", error);
      return fetchReviewsFromLocalStorage(productSlug);
    }
  } else {
    return fetchReviewsFromLocalStorage(productSlug);
  }
}

export function subscribeToReviews(productSlug: string, callback: (reviews: Review[]) => void): () => void {
  if (isFirebaseConfigured && db) {
    const path = "reviews";
    const q = query(
      collection(db, path),
      where("productSlug", "==", productSlug),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
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

      // Sort in-memory descending by createdAt
      reviewsList.sort((a, b) => {
        const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return tB - tA;
      });
      callback(reviewsList);
    }, (error) => {
      console.warn("Firestore live subscription error, loading from database once:", error);
      fetchReviewsFromDb(productSlug).then(callback);
    });

    return unsubscribe;
  } else {
    callback(fetchReviewsFromLocalStorage(productSlug));
    return () => {};
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

  return [];
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

// -------------------------------------------------------------
// Live Orders Database Access Layer (Firestore + LocalStorage fallbacks)
// -------------------------------------------------------------

export interface OrderData {
  id?: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: any[];
  totalPrice: string;
  paymentMethod: string;
  notes: string;
  status: "new" | "under process" | "delivered" | "cancel" | "refund" | "exchange";
  createdAt?: any;
}

export async function addOrderToDb(order: Omit<OrderData, "id" | "createdAt">): Promise<OrderData> {
  if (isFirebaseConfigured && db) {
    const path = "orders";
    try {
      // Secure generate auto-ID from addDoc, conforming to strict firestore.rules
      const docRef = await addDoc(collection(db, path), {
        orderId: order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        items: order.items,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        notes: order.notes || "",
        status: order.status || "new",
        createdAt: serverTimestamp(),
      });
      console.log("Order written securely to Firestore backend ledger:", docRef.id);
      return {
        ...order,
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
      console.error("Firestore order write error. Falling back to LocalStorage:", error);
      return addOrderToLocalStorage(order);
    }
  } else {
    return addOrderToLocalStorage(order);
  }
}

export async function fetchOrdersFromDb(): Promise<OrderData[]> {
  if (isFirebaseConfigured && db) {
    const path = "orders";
    try {
      const q = query(
        collection(db, path),
        orderBy("createdAt", "desc"),
        limit(200)
      );
      const snapshot = await getDocs(q);
      const ordersList: OrderData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersList.push({
          id: doc.id,
          orderId: data.orderId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          customerAddress: data.customerAddress,
          items: data.items || [],
          totalPrice: data.totalPrice,
          paymentMethod: data.paymentMethod,
          notes: data.notes || "",
          status: data.status || "new",
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      return ordersList;
    } catch (error: any) {
      if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (specError) {
          console.error("Firestore spec list error logged:", specError);
        }
      }
      console.error("Firestore orders read error. Falling back to LocalStorage:", error);
      return fetchOrdersFromLocalStorage();
    }
  } else {
    return fetchOrdersFromLocalStorage();
  }
}

export async function updateOrderStatusInDb(id: string, status: "new" | "under process" | "delivered" | "cancel" | "refund" | "exchange"): Promise<boolean> {
  if (isFirebaseConfigured && db && !id.startsWith("local_")) {
    const path = `orders/${id}`;
    try {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, {
        status: status,
      });
      console.log(`Order ${id} status updated to ${status} in Firestore.`);
      return true;
    } catch (error: any) {
      if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
      console.error("Firestore order update error:", error);
      throw error;
    }
  } else {
    return updateOrderStatusInLocalStorage(id, status);
  }
}

function fetchOrdersFromLocalStorage(): OrderData[] {
  const saved = localStorage.getItem("orders_ledger");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

function addOrderToLocalStorage(order: Omit<OrderData, "id" | "createdAt" | "status"> & { status?: any }): OrderData {
  const existing = fetchOrdersFromLocalStorage();
  const newOrder: OrderData = {
    ...order,
    id: `local_ord_${Date.now()}`,
    status: order.status || "new",
    createdAt: new Date()
  };
  const updated = [newOrder, ...existing];
  localStorage.setItem("orders_ledger", JSON.stringify(updated));
  return newOrder;
}

function updateOrderStatusInLocalStorage(id: string, status: "new" | "under process" | "delivered" | "cancel" | "refund" | "exchange"): boolean {
  const existing = fetchOrdersFromLocalStorage();
  const index = existing.findIndex((o) => o.id === id);
  if (index !== -1) {
    existing[index].status = status;
    localStorage.setItem("orders_ledger", JSON.stringify(existing));
    return true;
  }
  return false;
}

