import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Cloud Firestore Service for Lorica
 * Handles:
 * - User Profiles & Spiritual Streaks
 * - Prayer Intentions
 * - Favorite / Pinned Prayers & Novenas
 */
export const firestoreService = {
  // --- USER PROFILE & STREAKS ---
  async syncUserProfile(user, additionalData = {}) {
    if (!user || !user.id) return null;
    const userRef = doc(db, 'users', user.id);
    try {
      const snap = await getDoc(userRef);
      const now = new Date().toISOString();
      if (!snap.exists()) {
        const newProfile = {
          uid: user.id,
          name: user.name || 'Pilgrim',
          email: user.email || '',
          picture: user.picture || null,
          streakDays: 1,
          lastPrayedAt: now,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...additionalData
        };
        await setDoc(userRef, newProfile);
        return newProfile;
      } else {
        const existing = snap.data();
        await updateDoc(userRef, {
          name: user.name || existing.name,
          email: user.email || existing.email,
          picture: user.picture || existing.picture,
          updatedAt: serverTimestamp(),
          ...additionalData
        });
        return { ...existing, ...additionalData };
      }
    } catch (e) {
      console.warn('Firestore syncUserProfile warning:', e.message);
      return null;
    }
  },

  async recordPrayerStreak(userId) {
    if (!userId) return null;
    const userRef = doc(db, 'users', userId);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const last = data.lastPrayedAt ? new Date(data.lastPrayedAt) : null;
        const now = new Date();
        let newStreak = data.streakDays || 1;

        if (last) {
          const diffHours = (now - last) / (1000 * 60 * 60);
          if (diffHours >= 20 && diffHours < 48) {
            newStreak += 1;
          } else if (diffHours >= 48) {
            newStreak = 1;
          }
        }

        await updateDoc(userRef, {
          streakDays: newStreak,
          lastPrayedAt: now.toISOString(),
          updatedAt: serverTimestamp()
        });
        return newStreak;
      }
    } catch (e) {
      console.warn('Firestore recordPrayerStreak warning:', e.message);
    }
    return 1;
  },

  // --- PRAYER INTENTIONS ---
  async getIntentions(userId) {
    if (!userId) {
      const local = localStorage.getItem('lorica_intentions');
      return local ? JSON.parse(local) : [];
    }
    try {
      const colRef = collection(db, 'users', userId, 'intentions');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Firestore getIntentions fallback to localStorage:', e.message);
      const local = localStorage.getItem('lorica_intentions');
      return local ? JSON.parse(local) : [];
    }
  },

  async addIntention(userId, intentionData) {
    const item = {
      ...intentionData,
      createdAt: new Date().toISOString(),
      answered: false
    };

    if (!userId) {
      const local = localStorage.getItem('lorica_intentions');
      const list = local ? JSON.parse(local) : [];
      const withId = { id: Date.now().toString(), ...item };
      list.unshift(withId);
      localStorage.setItem('lorica_intentions', JSON.stringify(list));
      return withId;
    }

    try {
      const colRef = collection(db, 'users', userId, 'intentions');
      const docRef = await addDoc(colRef, {
        ...item,
        timestamp: serverTimestamp()
      });
      return { id: docRef.id, ...item };
    } catch (e) {
      console.warn('Firestore addIntention fallback to localStorage:', e.message);
      const local = localStorage.getItem('lorica_intentions');
      const list = local ? JSON.parse(local) : [];
      const withId = { id: Date.now().toString(), ...item };
      list.unshift(withId);
      localStorage.setItem('lorica_intentions', JSON.stringify(list));
      return withId;
    }
  },

  async deleteIntention(userId, intentionId) {
    if (!userId) {
      const local = localStorage.getItem('lorica_intentions');
      if (local) {
        const list = JSON.parse(local).filter(i => i.id !== intentionId);
        localStorage.setItem('lorica_intentions', JSON.stringify(list));
      }
      return;
    }
    try {
      const docRef = doc(db, 'users', userId, 'intentions', intentionId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Firestore deleteIntention warning:', e.message);
    }
  },

  // --- FAVORITES & BOOKMARKS ---
  async getFavorites(userId) {
    if (!userId) {
      const saved = localStorage.getItem('lorica_favorites');
      return saved ? JSON.parse(saved) : [];
    }
    try {
      const docRef = doc(db, 'users', userId, 'userData', 'favorites');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data().items || [];
      }
      return [];
    } catch (e) {
      console.warn('Firestore getFavorites fallback to localStorage:', e.message);
      const saved = localStorage.getItem('lorica_favorites');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async saveFavorites(userId, items) {
    if (!userId) {
      localStorage.setItem('lorica_favorites', JSON.stringify(items));
      return;
    }
    try {
      const docRef = doc(db, 'users', userId, 'userData', 'favorites');
      await setDoc(docRef, { items, updatedAt: serverTimestamp() });
    } catch (e) {
      console.warn('Firestore saveFavorites warning:', e.message);
      localStorage.setItem('lorica_favorites', JSON.stringify(items));
    }
  }
};
