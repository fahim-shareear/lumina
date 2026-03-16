'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, updateProfile, updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user'); // 'admin' or 'user'

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            // Check if user is admin
            const isAdmin = user.email === 'admin@lumina.com';
            setRole(isAdmin ? 'admin' : 'user');
            setUser(user);
          } else {
            setUser(null);
            setRole('user');
          }
        } catch (innerError) {
          console.error('Error processing auth state change:', innerError);
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error('Firebase auth error:', error);
        setLoading(false);
      });
    } catch (error) {
      console.error('Failed to initialize Firebase auth listener:', error);
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password, displayName = '') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return result;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    return firebaseSignOut(auth);
  };
  
  const updateUserProfile = async (data) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updateProfile(auth.currentUser, data);
    // Refresh user state
    setUser({ ...auth.currentUser });
  };

  const updateUserPassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updatePassword(auth.currentUser, newPassword);
  };

  const sendPasswordReset = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    role,
    isAdmin: role === 'admin',
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    updateUserPassword,
    sendPasswordReset,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}