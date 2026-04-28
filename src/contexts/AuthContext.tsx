import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';

export type UserRole = 'trainee' | 'manager';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (e: string, p: string, role: UserRole) => Promise<void>;
    signup: (e: string, p: string, name: string, role: UserRole) => Promise<void>;
    loginWithGoogle: (role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};

// Helper to build our User object from Firebase user
const buildUser = (fbUser: FirebaseUser, role: UserRole): User => ({
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    role,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
                const savedRole = localStorage.getItem(`pulse_role_${fbUser.uid}`) as UserRole || 'trainee';
                setUser(buildUser(fbUser, savedRole));
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const saveRole = (uid: string, role: UserRole) => {
        localStorage.setItem(`pulse_role_${uid}`, role);
    };

    const login = async (email: string, password: string, role: UserRole) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        saveRole(result.user.uid, role);
        setUser(buildUser(result.user, role));
    };

    const signup = async (email: string, password: string, displayName: string, role: UserRole) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        saveRole(result.user.uid, role);
        setUser(buildUser(result.user, role));
    };

    const loginWithGoogle = async (role: UserRole) => {
        const result = await signInWithPopup(auth, googleProvider);
        saveRole(result.user.uid, role);
        setUser(buildUser(result.user, role));
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const value = { user, login, signup, loginWithGoogle, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
