import { Image, StyleSheet, Platform, Text, Button, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { editDiary, getDiaryByDate, addDiary, finduserDetails, deleteDiaryData } from "@/components/backend/database";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function addOld({ route, navigation }) {
    const theme = useColorScheme();
    const colortheme = Colors[theme];
    const [editable, setEditable] = useState(false);
    const router = useRouter();
    const [dateval, setDate] = useState(""); // State for holding the date
    const [diary, setDiary] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const { data } = useLocalSearchParams();

    const getTodaysDiary = async (date, email) => {
        setDiary("");
        const res = await getDiaryByDate(date, email);

        if (res) {
            setDiary(res);
            setIsEdit(true);
            // Set the diary entry if available
        }
    };
    const lightTheme = {
        color: "#888",
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
    useFocusEffect(
        React.useCallback(() => {
            setDate(data);

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
            setUser(re);
            getTodaysDiary(dateval, re.email);
        }
    }
    useEffect(() => {
        if (dateval) {
            initUser(); // Fetch diary based on the date;
        }
        navigation?.setOptions({
            title: "Edit", // This sets the title to the passed value
        });
    }, [dateval]);
    // Function to handle saving the diary entry
    const handleSave = async () => {
        if (dateval && diary) {
            setIsLoading(true);
            try {
                if (!isEdit) {
                    const res = await addDiary(dateval, new Date().getFullYear(), new Date().getDay().toString(), diary, user.email);
                } else {
                    const res = await editDiary(dateval, new Date().getFullYear(), new Date().getDay().toString(), diary, user.email);
                }
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: "Data is added !",
                });
            } catch (error) {
                console.log("Error occured ...!");
            } finally {
                setIsLoading(false);
                router.navigate("/(tabs)");
            }
        } else {
            Alert.alert("Invalid Paramters !", "Data cannot be empty..");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    height: "100%",
                    backgroundColor: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor,
                }}
            >
                <AlertNotificationRoot>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={90}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <View style={styles.container}>
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
                                    disabled={!isEdit}
                                    onPress={() => {
                                        Alert.alert(
                                            "Delete data?", // Title
                                            " Delete the current entry ?", // Message
                                            [
                                                {
                                                    text: "Cancel", // Cancel button
                                                    style: "cancel", // 'cancel' style for a non-destructive action
                                                },
                                                {
                                                    text: "Delete", // Destructive button
                                                    style: "destructive", // This marks the button as destructive
                                                    onPress: async () => {
                                                        try {
                                                            await deleteDiaryData(user?.email, dateval);
                                                            router.navigate("/(tabs)/");
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }, // Action to take if confirmed
                                                },
                                            ],
                                            { cancelable: true }
                                        );
                                    }}
                                >
                                    <MaterialIcons name="delete" size={24} color={isEdit ? "red" : darkTheme.contentBackground} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.placeholder}>
                                <View
                                    style={[
                                        styles.placeholderInset,
                                        { borderColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground },
                                    ]}
                                >
                                    <View style={styles.contentContainer}>
                                        <TextInput
                                            editable={true}
                                            multiline={true}
                                            style={[
                                                styles.TextInput,
                                                {
                                                    backgroundColor:
                                                        theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                                    color: colortheme.text,
                                                    paddingHorizontal: 20,
                                                    elevation: 40,
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
                                                    backgroundColor:
                                                        theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[styles.saveText, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}
                                            >
                                                {isEdit ? "UPDATE" : "ADD"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </AlertNotificationRoot>
            </SafeAreaView>
        </SafeAreaProvider>
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
        borderWidth: 4,
        borderColor: "#e5e7eb",
        borderStyle: "dashed",
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
});
