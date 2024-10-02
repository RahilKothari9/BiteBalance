import { useContext, createContext, useEffect, useState } from "react";
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithRedirect
} from 'firebase/auth';
import { auth } from "../config/firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const googleSignIn = async() => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const firestore = getFirestore();
            const userDoc = doc(firestore, 'users', user.uid);
            await setDoc(userDoc, {
                name: user.displayName,
                email: user.email,
                profile_picture: user.photoURL,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const logOut = () => {
        signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User', currentUser)
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};