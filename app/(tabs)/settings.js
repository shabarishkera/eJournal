import { Image, StyleSheet, Platform, Text, Button, View, TouchableOpacity, ScrollView, Switch, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { Component, useState } from "react";
import ActionSheet from "react-native-actions-sheet";
import { Linking, ToastAndroid } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import { useAuth } from "@/components/store/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "@/components/ui/Modal";

export default function Settings(props) {
    const [user, setUser] = useState(null);
    const ratingSheetRef = useRef(null);
    const { userToken, setUserToken } = useAuth();

    const router = useRouter();
    const theme = useColorScheme();

    async function initUser() {
        try {
            const res = await AsyncStorage.getItem("userToken");

            if (res !== null) {
                let parsedRes = JSON.parse(res);

                setUser(parsedRes);
            } else {
                console.log("No user data found");
                // Handle case when no userToken exists, e.g., set default user or redirect to login
            }
        } catch (error) {
            console.error("Error retrieving user data", error);
        }
    }

    const [form, setForm] = useState({
        emailNotifications: true,
        pushNotifications: false,
        rating: 1,
    });
    const [showModal, setShowModal] = useState(false);
    const actionSheetRef = useRef(null);
    useEffect(() => {
        initUser();
    }, []);
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
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View style={styles.header}>
                    <View style={styles.headerAction}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                        >
                            {/* <FeatherIcon color="#000" name="arrow-left" size={24} /> */}
                        </TouchableOpacity>
                    </View>

                    <Text numberOfLines={1} style={[styles.headerTitle, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                        Settings
                    </Text>

                    <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                        >
                            <FeatherIcon color="#000" name="more-vertical" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={[styles.section, { paddingTop: 4 }]}>
                        <Text style={styles.sectionTitle}>Account</Text>

                        <View style={styles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => {
                                    router.navigate("/(tabs)/explore");
                                }}
                                style={[
                                    styles.profile,
                                    { backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground },
                                ]}
                            >
                                <Image alt="" source={{ uri: user?.avatarUrl }} style={styles.profileAvatar} />

                                <View style={styles.profileBody}>
                                    <Text style={[styles.profileName, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        {user?.name}
                                    </Text>

                                    <Text style={styles.profileHandle}>{user?.email || "john@example.com"}</Text>
                                </View>

                                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.section]}>
                        <Text style={styles.sectionTitle}>Preferences</Text>

                        <View style={[styles.sectionBody]}>
                            <View
                                style={[
                                    styles.rowWrapper,
                                    styles.rowFirst,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        Language
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <Text style={styles.rowValue}>English</Text>

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={[
                                    styles.rowWrapper,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        Location
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <Text style={styles.rowValue}>India</Text>

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={[
                                    styles.rowWrapper,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <View style={styles.row}>
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        Daily Remainders
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <Switch
                                        onValueChange={(emailNotifications) => setForm({ ...form, emailNotifications })}
                                        style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                        value={form.emailNotifications}
                                    />
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.rowWrapper,
                                    styles.rowLast,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <View style={styles.row}>
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        Push Notifications
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <Switch
                                        onValueChange={(pushNotifications) => setForm({ ...form, pushNotifications })}
                                        style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                        value={form.pushNotifications}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Resources</Text>

                        <View style={styles.sectionBody}>
                            <View
                                style={[
                                    styles.rowWrapper,
                                    styles.rowFirst,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        const email = "shabarishkera@gmail.com";
                                        const subject = "Enqiry/contact";
                                        const body = "";

                                        // Create the mailto link
                                        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                                            body
                                        )}`;

                                        // Open the email client
                                        Linking.openURL(url).catch((err) => console.error("Failed to open email client", err));
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        <Text>Contact Us</Text>
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={[
                                    styles.rowWrapper,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        const email = "shabarishkera@gmail.com";
                                        const subject = "Report bug";
                                        const body = "";

                                        // Create the mailto link
                                        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                                            body
                                        )}`;

                                        // Open the email client
                                        Linking.openURL(url).catch((err) => console.error("Failed to open email client", err));
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        <Text>Report Bug</Text>
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={[
                                    styles.rowWrapper,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        ratingSheetRef.current?.show();
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        Rate App
                                    </Text>

                                    <View style={styles.rowSpacer} />
                                </TouchableOpacity>
                            </View>
                            <ActionSheet ref={ratingSheetRef}>
                                <Rating
                                    showRating
                                    startingValue={form.rating}
                                    onFinishRating={(rating) => {
                                        setForm({ ...form, rating });
                                    }}
                                    style={{ paddingVertical: 30 }}
                                />
                                <TouchableOpacity onPress={() => ratingSheetRef.current?.hide()} style={{ borderRadius: 10, elevation: 0 }}>
                                    <Text style={[styles.actionBtn]}>OK</Text>
                                </TouchableOpacity>
                            </ActionSheet>
                            <View
                                style={[
                                    styles.rowWrapper,
                                    styles.rowLast,
                                    {
                                        backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.borderColor,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        ToastAndroid.show("Terms is not available right now !", ToastAndroid.SHORT);
                                        setShowModal(!showModal);
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                        Terms and Privacy
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionBody}>
                            <View
                                style={[
                                    styles.rowWrapper,
                                    styles.rowFirst,
                                    styles.rowLast,
                                    {
                                        alignItems: "center",
                                        backgroundColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                        borderColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                        actionSheetRef.current?.show();
                                    }}
                                    style={styles.row}
                                >
                                    <Text
                                        style={[
                                            styles.rowLabel,
                                            styles.rowLabelLogout,
                                            {
                                                backgroundColor:
                                                    theme == "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                            },
                                        ]}
                                    >
                                        Log Out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.contentFooter}>App Version 1.0</Text>
                    <ActionSheet
                        ref={actionSheetRef}
                        containerStyle={{
                            backgroundColor: theme == "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                        }}
                    >
                        <Text style={[styles.actionHeadding, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                            Are You Sure To log out ?
                        </Text>
                        <View style={styles.actionWrap}>
                            <TouchableOpacity
                                onPress={() => {
                                    actionSheetRef.current?.hide();
                                    setUserToken(null);
                                    AsyncStorage.removeItem("userToken");
                                }}
                            >
                                <Text style={styles.actionBtn}>ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
                                <Text style={[styles.actionBtn, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                                    cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ActionSheet>
                    {showModal && <Modal onClose={() => setShowModal(false)} />}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    /** Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
    },
    actionBtn: {
        textAlign: "center",
        margin: 15,
        fontSize: 20,
        color: "red",
    },
    actionWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    actionHeadding: {
        textAlign: "center",
        fontFamily: "roboto",
        marginTop: 10,
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: "600",
        color: "#000",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        textAlign: "center",
    },
    /** Content */
    content: {
        paddingHorizontal: 16,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
        color: "#a69f9f",
    },
    /** Section */
    section: {
        paddingVertical: 12,
    },
    sectionTitle: {
        margin: 8,
        marginLeft: 12,
        fontSize: 13,
        letterSpacing: 0.33,
        fontWeight: "500",
        color: "#a69f9f",
        textTransform: "uppercase",
    },
    sectionBody: {
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    /** Profile */
    profile: {
        padding: 12,

        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#266ef1",
    },
    profileBody: {
        marginRight: "auto",
    },
    profileName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#292929",
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: "400",
        color: "#858585",
    },
    /** Row */
    row: {
        height: 44,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingRight: 12,
    },
    rowWrapper: {
        paddingLeft: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
    },
    rowFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    rowLabel: {
        fontSize: 16,
        letterSpacing: 0.24,
        color: "#000",
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ababab",
        marginRight: 4,
    },
    rowLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    rowLabelLogout: {
        width: "100%",
        textAlign: "center",
        fontWeight: "600",
        color: "#dc2626",
    },
});
