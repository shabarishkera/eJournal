import React, { useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, StatusBar, useColorScheme } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Toast } from "expo-toast";
import { createuser } from "../backend/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Login() {
    const [isLogin, setIslogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [colortheme] = useColorScheme();
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleOnPress = async () => {
        try {
            if (!isLogin) if (email && password === confirmPassword) AsyncStorage.setItem("userToken", email);
        } catch (error) {
            console.log("unable to create user");
        }
    };
    return (
        <ThemedView style={[styles.container, { backgroundColor: colortheme.background }]}>
            <StatusBar />
            <View style={styles.logoView}>
                <Image source={require("../../assets/images/notebook.png")} resizeMode="contain" style={styles.logo} />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    value={email}
                    style={styles.inputText}
                    placeholder="Email"
                    textContentType="emailAddress"
                    placeholderTextColor="#AFAFAF"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    value={password}
                    style={styles.inputText}
                    placeholder="Password"
                    textContentType="password"
                    secureTextEntry
                    placeholderTextColor="#AFAFAF"
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            {!isLogin && (
                <View style={styles.inputView}>
                    <TextInput
                        value={confirmPassword}
                        style={styles.inputText}
                        placeholder=" Confirm Password"
                        textContentType="password"
                        secureTextEntry
                        placeholderTextColor="#AFAFAF"
                        onChangeText={(password) => setConfirmPassword(password)}
                    />
                </View>
            )}

            <TouchableOpacity style={styles.loginBtn} onPress={handleOnPress}>
                <Text style={styles.loginText}>{isLogin ? "LOGIN" : "SIGNUP"}</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity style={{ marginHorizontal: 15 }}>
                    <ThemedText style={styles.forgot}>Forgot Password?</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIslogin(!isLogin)}>
                    <Text style={styles.singUp}>{isLogin ? "SignUp " : "Login"}</Text>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40,
        width: 250,
        height: 100,
    },
    inputView: {
        width: "80%",
        backgroundColor: "#EAEAEA",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
    },
    inputText: {
        height: 50,
        color: "#777777",
        fontWeight: "800",
    },
    singUp: {
        color: "#39B54A",
        fontWeight: "500",
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#39B54A",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    loginText: {
        color: "#ffffff",
        fontWeight: "800",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    logoView: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 15,
        marginTop: 0,
    },
    forgot: {
        fontWeight: "normal",
    },
});
