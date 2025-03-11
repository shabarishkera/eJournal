import { Tabs } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HapticTab } from "@/components/HapticTab";
import Feather from "@expo/vector-icons/Feather";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "@/components/ui/Login";
import { init } from "@/components/backend/database";
import Foundation from "@expo/vector-icons/Foundation";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@/components/store/Store";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { userToken, setUserToken, loading, setLoading } = useAuth();
    console.log(userToken, setUserToken);
    // const [userTocken, setUserTocken] = useState<String | null>(null);

    const theme = useColorScheme();

    if (loading)
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={"large"} />
                </SafeAreaView>
            </SafeAreaProvider>
        );

    if (!userToken)
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Login setUserTocken={setUserToken} />
                </SafeAreaView>
            </SafeAreaProvider>
        );

    return (
        <Tabs
            screenListeners={{
                tabPress: (e) => {
                    // You can also do something else when a tab is pressed if
                    // ruter.push(e.target.name);
                    //  Haptics.selectionAsync();
                },
            }}
            screenOptions={{
                tabBarActiveTintColor: theme === "dark" ? "#0a7ea4" : "#0a7ea4",
                headerShown: false,
                tabBarInactiveTintColor: theme === "dark" ? "gray" : "black",
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                key={`index-${Math.random()}`} // Ensure re-render on tab switch by adding a random key
                options={{
                    title: "Home",

                    tabBarIcon: ({ color }) => <Foundation name="book" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                key={`add-${Math.random()}`} // Ensure re-render on tab switch by adding a random key
                options={{
                    title: "Add",
                    tabBarIcon: ({ color }) => <Foundation name="page-add" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                key={`settings-${Math.random()}`} // Ensure re-render on tab switch by adding a random key
                options={{
                    title: "Settings",

                    tabBarIcon: ({ color }) => <Feather name="settings" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                key={`explore-${Math.random()}`} // Ensure re-render on tab switch by adding a random key
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <AntDesign name="user" size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}
