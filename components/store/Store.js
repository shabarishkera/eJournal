import React, { createContext, useState, useEffect, useContext, useLayoutEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { init } from "../backend/database";
// Define a context for user authentication
const AuthContext = createContext();

export default function Store(props) {
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the user token from AsyncStorage when the app starts
    useEffect(() => {
        (async () => {
            try {
                await init();
                const token = await AsyncStorage.getItem("userToken");
                setUserToken(JSON.parse(token));
                setLoading(false);
            } catch (err) {
                console.log("Cannot load data", err);
                setUserToken(null);
                setLoading(false); // Set to null if error occurs
            }
        })();
    }, []);

    // Return the context provider with userToken and setUserToken
    return <AuthContext.Provider value={{ userToken, setUserToken, loading, setLoading }}>{props.children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
