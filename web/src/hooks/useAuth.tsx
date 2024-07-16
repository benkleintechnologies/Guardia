// src/hooks/useAuth.ts
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { auth } from '../firebase';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential } from 'firebase/auth';

interface AuthContextProps {
    currentUser: User | null;
    initializing: boolean;
    signUp: (email: string, password: string) => Promise<UserCredential>;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        //Get user from local storage if already logged in
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        //Set currentUser in local storage
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                setCurrentUser(null);
                localStorage.removeItem('currentUser');
            }
            setInitializing(false);
        });

        return unsubscribe;
    }, []);

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setCurrentUser(userCredential.user);
            localStorage.setItem('currentUser', JSON.stringify(userCredential.user)); //Save user login
            return userCredential;
        });
    };

    const signIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setCurrentUser(userCredential.user);
            localStorage.setItem('currentUser', JSON.stringify(userCredential.user)); //Save user login
            return userCredential;
        });
    };

    const signOutUser = () => {
        return signOut(auth).then(() => {
            setCurrentUser(null);
            localStorage.removeItem('currentUser');
        });
    };

    const value = {
        currentUser,
        initializing,
        signUp,
        signIn,
        signOut: signOutUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};