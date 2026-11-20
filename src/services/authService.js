// Unified Authentication Service for Lorica
// Supports Firebase Auth (Google Popup/Redirect & Email/Password) + GIS fallback

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { firestoreService } from './firestoreService';

export const GOOGLE_CLIENT_ID = '669995171000-g1i0g15pv4ji86fa0oa6s4obin3j2l2n.apps.googleusercontent.com';

class AuthService {
  constructor() {
    this.user = this.loadUser();
    this.listeners = new Set();

    // Listen to Firebase auth state changes
    try {
      onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const formatted = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || 'Pilgrim',
            givenName: fbUser.displayName ? fbUser.displayName.split(' ')[0] : 'Pilgrim',
            picture: fbUser.photoURL || null,
            signedInAt: new Date().toISOString()
          };
          this.saveUser(formatted);
          await firestoreService.syncUserProfile(formatted);
        } else if (!this.user?.isGuest) {
          // Keep current user if set via custom/GIS unless logged out
        }
      });
    } catch (e) {
      console.warn('Firebase onAuthStateChanged init note:', e.message);
    }
  }

  loadUser() {
    try {
      const saved = localStorage.getItem('lorica_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveUser(user) {
    this.user = user;
    if (user) {
      try {
        localStorage.setItem('lorica_auth_user', JSON.stringify(user));
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem('lorica_auth_user');
      } catch (e) {}
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.user);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.user);
      } catch (e) {}
    });
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.user;
  }

  // --- FIREBASE AUTH METHODS ---
  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const formatted = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || 'Pilgrim',
        givenName: fbUser.displayName ? fbUser.displayName.split(' ')[0] : 'Pilgrim',
        picture: fbUser.photoURL || null,
        signedInAt: new Date().toISOString()
      };
      this.saveUser(formatted);
      await firestoreService.syncUserProfile(formatted);
      return { success: true, user: formatted };
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      return { success: false, error: error.message };
    }
  }

  async signInWithEmail(email, password) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = res.user;
      const formatted = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || email.split('@')[0],
        givenName: email.split('@')[0],
        picture: null,
        signedInAt: new Date().toISOString()
      };
      this.saveUser(formatted);
      await firestoreService.syncUserProfile(formatted);
      return { success: true, user: formatted };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async registerWithEmail(email, password, displayName) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = res.user;
      const formatted = {
        id: fbUser.uid,
        email: fbUser.email,
        name: displayName || email.split('@')[0],
        givenName: displayName || email.split('@')[0],
        picture: null,
        signedInAt: new Date().toISOString()
      };
      this.saveUser(formatted);
      await firestoreService.syncUserProfile(formatted);
      return { success: true, user: formatted };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // --- GIS LEGACY DECODE ---
  decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return null;
    }
  }

  handleCredentialResponse(response) {
    if (!response || !response.credential) return;
    const payload = this.decodeJwt(response.credential);
    if (payload) {
      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.given_name || 'Pilgrim',
        givenName: payload.given_name || payload.name || 'Pilgrim',
        picture: payload.picture || null,
        locale: payload.locale || 'en',
        signedInAt: new Date().toISOString()
      };
      this.saveUser(user);
      firestoreService.syncUserProfile(user);
    }
  }

  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    this.saveUser(null);
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export const authService = new AuthService();
