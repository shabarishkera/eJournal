import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { addDiary, getDiaryByDate, editDiary, finduserDetails } from "@/components/backend/database";
import { Colors } from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertNotificationRoot } from "react-native-alert-notification";
export default function Add() {
    const theme = useColorScheme();
    const colortheme = Colors[theme];
    const router = useRouter();
    const [dateval, setDate] = useState(""); // State for holding the date
    const [diary, setDiary] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    //only happens in case for the  // State for holding the diary text
    const lightTheme = {
        color: "##636161",
        contentBackground: "#f8f8f8",
        backgroundColor: "#ffffff",
        borderColor: "#f0f0f0",
    };
    const darkTheme = {
        color: "#fff",
        backgroundColor: "#000",
        contentBackground: "#2d4150",
        borderColor: "#888",
    };
    // Format the date as 'YYYY-MM-DD'
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Function to fetch today's diary entry based on date
    const getTodaysDiary = async (date, email) => {
        setDiary("");
        const res = await getDiaryByDate(date, email);

        if (res) {
            setDiary(res);
            setIsEdit(true);
            // Set the diary entry if available
        }
    };

    // This useEffect ensures that the date is updated correctly when the component is focused
    useFocusEffect(
        React.useCallback(() => {
            const currentDate = formatDate(new Date());
            setDate(currentDate);

            return () => {
                setDate(null);
                setDiary("");
            };
            // Update dateval based on params or today's date
        }, []) // Depend on `data` to trigger effect when params change
    );
    async function initUser() {
        const res = await AsyncStorage.getItem("userToken");
        const parsedRes = await JSON.parse(res);
        const re = await finduserDetails(parsedRes.email);

        if (re) {
            getTodaysDiary(dateval, re.email);
            setUser(re);
        }
    }

    // This useEffect ensures that diary data is fetched after the dateval is set
    useEffect(() => {
        if (dateval) {
            // Fetch diary based on the date
        }
        initUser();
    }, [dateval]); // Run whenever `dateval` changes

    // Function to handle saving the diary entry
    const handleSave = async () => {
        if (dateval && diary) {
            setIsLoading(true);
            try {
                if (!isEdit) {
                    const res = await addDiary(dateval, new Date().getFullYear(), new Date().getDay().toString(), diary, user?.email);
                } else {
                    const res = await editDiary(dateval, new Date().getFullYear(), new Date().getDay().toString(), diary, user?.email);
                }

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                console.log("Error occured ...!");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } finally {
                setIsLoading(false);
                router.navigate("/(tabs)");
            }
        } else {
            Alert.alert("Invalid Paramters !", "Data cannot be empty..");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor }}>
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={20} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={[styles.container]}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                alt=""
                                source={
                                    // assuming user.avatarUrl is like '@/assets/images/avatar.png'
                                    {
                                        uri: user?.avatarUrl,
                                    }
                                }
                                style={styles.avatar}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                        >
                            <FeatherIcon color={theme == "dark" ? darkTheme.color : lightTheme.color} name="more-vertical" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.placeholder}>
                        <View
                            style={[
                                styles.placeholderInset,
                                { borderColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground },
                            ]}
                        >
                            <View style={[styles.contentContainer]}>
                                <TextInput
                                    editable={true}
                                    multiline={true}
                                    style={[
                                        styles.TextInput,
                                        {
                                            backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                            color: colortheme.text,
                                            paddingHorizontal: 20,
                                            elevation: 10,
                                        },
                                    ]}
                                    value={diary}
                                    placeholder="Journal your day ..."
                                    placeholderTextColor="gray"
                                    onChangeText={(phrasetext) => setDiary(phrasetext)}
                                    textAlignVertical="top"
                                />

                                <TouchableOpacity
                                    disabled={isloading}
                                    onPress={handleSave}
                                    style={[
                                        styles.saveBtn,
                                        {
                                            backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                            borderWidth: 1,
                                            borderColor: theme === "dark" ? darkTheme.contentBackground : "#266ef1",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.saveText,
                                            {
                                                color: theme == "dark" ? darkTheme.color : lightTheme.color,
                                            },
                                        ]}
                                    >
                                        {isEdit ? "UPDATE" : "ADD"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
    },
    TextInput: {
        height: "85%",
        width: "95%",
        margin: 10,

        borderRadius: 12,
        textAlignVertical: "top",
    },
    saveBtn: {
        width: "80%",
        backgroundColor: "#39B54A",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    saveText: {
        color: "#ffffff",
        fontWeight: "800",
    },
    container: {
        padding: 24,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: "#266ef1",
    },
    /** Placeholder */
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 24,
        padding: 0,
        backgroundColor: "transparent",
    },
    placeholderInset: {
        borderWidth: 3,
        borderColor: "#e5e7eb",
        borderStyle: "dashed",
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
});
