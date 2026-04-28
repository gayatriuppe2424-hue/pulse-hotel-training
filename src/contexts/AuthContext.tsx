import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User Interface simplified since we remove Firebase
export interface User {
    uid: string;
    email: string;
    displayName: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (e: string, p: string) => Promise<void>;
    signup: (e: string, p: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>({ uid: 'mock-user-123', email: 'guest@hotel.com', displayName: 'Guest User' });
    const [loading, setLoading] = useState(true);

    const signup = async (email: string, _password: string, displayName: string) => {
        setUser({ uid: 'mock-user-123', email, displayName });
    };

    const login = async (email: string, _password: string) => {
        setUser({ uid: 'mock-user-123', email, displayName: 'Guest User' });
    };

    const logout = async () => {
        setUser(null);
    };

    useEffect(() => {
        // Simulate initial fast load
        setLoading(false);
    }, []);

    const value = { user, login, signup, logout, loading };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
