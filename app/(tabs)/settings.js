import { Image, StyleSheet, Platform, Text, Button, View, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { Component, useState } from "react";
import ActionSheet from "react-native-actions-sheet";
import { Linking } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Settings() {
    const [user, setUser] = useState(null);
    const placeholder = require("@/assets/images/profile.jpg");
    const router = useRouter();
    async function initUser() {
        try {
            const res = await AsyncStorage.getItem("userToken");

            if (res !== null) {
                let parsedRes = JSON.parse(res);
                console.log("in init user", parsedRes);
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
    });
    const actionSheetRef = useRef(null);
    useEffect(() => {
        initUser();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
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

                    <Text numberOfLines={1} style={styles.headerTitle}>
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
                                style={styles.profile}
                            >
                                <Image
                                    alt=""
                                    source={user?.avatarUrl ? { uri: user?.avatarUrl } : placeholder}
                                    style={styles.profileAvatar}
                                />

                                <View style={styles.profileBody}>
                                    <Text style={styles.profileName}>{user?.name}</Text>

                                    <Text style={styles.profileHandle}>{user?.email || "john@example.com"}</Text>
                                </View>

                                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>

                        <View style={styles.sectionBody}>
                            <View style={[styles.rowWrapper, styles.rowFirst]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.rowLabel}>Language</Text>

                                    <View style={styles.rowSpacer} />

                                    <Text style={styles.rowValue}>English</Text>

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rowWrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.rowLabel}>Location</Text>

                                    <View style={styles.rowSpacer} />

                                    <Text style={styles.rowValue}>India</Text>

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rowWrapper}>
                                <View style={styles.row}>
                                    <Text style={styles.rowLabel}>Email Notifications</Text>

                                    <View style={styles.rowSpacer} />

                                    <Switch
                                        onValueChange={(emailNotifications) => setForm({ ...form, emailNotifications })}
                                        style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                        value={form.emailNotifications}
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowWrapper, styles.rowLast]}>
                                <View style={styles.row}>
                                    <Text style={styles.rowLabel}>Push Notifications</Text>

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
                            <View style={[styles.rowWrapper, styles.rowFirst]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.rowLabel}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const email = "shabarishkera@gmail.com";
                                                const subject = "Enqiry/contact";
                                                const body = "";

                                                // Create the mailto link
                                                const url = `mailto:${email}?subject=${encodeURIComponent(
                                                    subject
                                                )}&body=${encodeURIComponent(body)}`;

                                                // Open the email client
                                                Linking.openURL(url).catch((err) => console.error("Failed to open email client", err));
                                            }}
                                        >
                                            <Text>Contact Us</Text>
                                        </TouchableOpacity>
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rowWrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.rowLabel}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const email = "shabarishkera@gmail.com";
                                                const subject = "Report bug";
                                                const body = "";

                                                // Create the mailto link
                                                const url = `mailto:${email}?subject=${encodeURIComponent(
                                                    subject
                                                )}&body=${encodeURIComponent(body)}`;

                                                // Open the email client
                                                Linking.openURL(url).catch((err) => console.error("Failed to open email client", err));
                                            }}
                                        >
                                            <Text>Report Bug</Text>
                                        </TouchableOpacity>
                                    </Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rowWrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.rowLabel}>Rate in App Store</Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.rowWrapper, styles.rowLast]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={styles.rowLabel}>Terms and Privacy</Text>

                                    <View style={styles.rowSpacer} />

                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionBody}>
                            <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast, { alignItems: "center" }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                        actionSheetRef.current?.show();
                                    }}
                                    style={styles.row}
                                >
                                    <Text style={[styles.rowLabel, styles.rowLabelLogout]}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.contentFooter}>App Version 1.0</Text>
                    <ActionSheet ref={actionSheetRef}>
                        <Text style={styles.actionHeadding}>Are You Sure To log out ?</Text>
                        <View style={styles.actionWrap}>
                            <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
                                <Text style={styles.actionBtn}>ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
                                <Text style={styles.actionBtn}>cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ActionSheet>
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
        backgroundColor: "#fff",
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
        borderColor: "#f0f0f0",
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
