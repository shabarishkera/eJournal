import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Alert,
    ScrollView,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createuser } from "../backend/database";
export default function Login({ setUserTocken }) {
    const [isLogin, setIslogin] = useState(true);
    const [email, setEmail] = useState("");

    const [colortheme] = useColorScheme();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        bio: "Update your bio",
        avatarUrl: null,
    });
    const handleOnPress = async () => {
        try {
            if (!isLogin) {
                if (form.email && form.name && form.password === form.confirmPassword) {
                    createuser(form.email, form.name, form.password, form.bio, form.avatarUrl);
                    AsyncStorage.setItem(
                        "userToken",
                        JSON.stringify({
                            email: form.email,
                            password: form.password,
                            name: form.name,
                            bio: "add you bio...",
                            avatarUrl: form.avatarUrl,
                        }),
                        async () => {
                            const res = await AsyncStorage.getItem("userToken");
                            setUserTocken(res);
                        }
                    );
                } else {
                    Alert.alert("Invalid Parameters", "Check your email or password ");
                }
            }
        } catch (error) {
            console.log("unable to create user", error);
        }
    };
    return (
        <KeyboardAvoidingView style={[{ flex: 1 }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                            style={styles.headerBack}
                        >
                            <FeatherIcon color="#1D2A32" name="chevron-left" size={30} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Let's Get Started!</Text>

                    <Text style={styles.subtitle}>Fill in the fields below to get started with your credentials.</Text>
                    <ScrollView>
                        <View style={[styles.form]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Full Name</Text>

                                <TextInput
                                    clearButtonMode="while-editing"
                                    onChangeText={(name) => setForm({ ...form, name })}
                                    placeholder="John Doe"
                                    style={styles.inputControl}
                                    value={form.name}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Email Address</Text>

                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    keyboardType="email-address"
                                    onChangeText={(email) => setForm({ ...form, email })}
                                    placeholder="john@example.com"
                                    style={styles.inputControl}
                                    value={form.email}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Password</Text>

                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={(password) => setForm({ ...form, password })}
                                    placeholder="********"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                    value={form.password}
                                />
                            </View>

                            {!isLogin && (
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Confirm Password</Text>

                                    <TextInput
                                        autoCorrect={false}
                                        clearButtonMode="while-editing"
                                        onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
                                        placeholder="********"
                                        style={styles.inputControl}
                                        secureTextEntry={true}
                                        value={form.confirmPassword}
                                    />
                                </View>
                            )}

                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleOnPress();
                                    }}
                                    style={styles.btn}
                                >
                                    <Text style={styles.btnText}>{isLogin ? "Login" : "Get Started"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setIslogin(!isLogin);
                    }}
                >
                    <Text style={styles.formFooter}>
                        {isLogin ? "Dont have an account?" : "Already have an account?"}{" "}
                        <Text style={{ textDecorationLine: "underline" }}>{isLogin ? "Sign up" : "Sing in"}</Text>
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 31,
        fontWeight: "700",
        color: "#1D2A32",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "500",
        color: "#929292",
    },
    /** Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    headerBack: {
        padding: 8,
        paddingTop: 0,
        position: "relative",
        marginLeft: -16,
    },
    /** Form */
    form: {
        marginTop: 24,
    },
    formAction: {
        marginTop: 4,
        marginBottom: 16,
    },
    formFooter: {
        paddingVertical: 24,
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
        textAlign: "center",
        letterSpacing: 0.15,
    },
    /** Input */
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: "600",
        color: "#222",
        marginBottom: 8,
    },
    inputControl: {
        height: 50,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: "500",
        color: "#222",
        borderWidth: 1,
        borderColor: "#C9D3DB",
        borderStyle: "solid",
    },
    /** Button */
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: "#075eec",
        borderColor: "#075eec",
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: "600",
        color: "#fff",
    },
});
