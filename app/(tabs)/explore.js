import {
    StyleSheet,
    Dimensions,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    Text,
    Image,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { Menu, MenuItem } from "react-native-material-menu";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLast30DaysData, fetchalldiary, deleteTables, finduserDetails, deleteUserData } from "@/components/backend/database";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { ContributionGraph } from "react-native-chart-kit";
import { useColorScheme } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { useAuth } from "@/components/store/Store";
const today = new Date();

let date = new Date(today);
date.setDate(today.getDate() + 7); // Subtract 'i' days

date.setDate(today.getDate() + 30);

const CARD_WIDTH = Math.min(Dimensions.get("screen").width * 0.75, 400);
export default function Explore() {
    const [items, setItems] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [entry, setEntry] = useState([]);
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const actionSheetRef = useRef(null);
    const { userToken, setUserToken } = useAuth();
    const stats = [
        { label: "Backup", value: "System" },
        { label: "Account Type", value: "Personal" },
        { label: "Entries", value: entry?.length },
    ];
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
    const [searchTerm, setSearchTerm] = useState("");
    const [showTimeline, setShowTimeline] = useState(false);
    async function initUser() {
        try {
            const res = await AsyncStorage.getItem("userToken");
            const parsedRes = await JSON.parse(res);
            const re = await finduserDetails(parsedRes.email);
            if (re) {
                setUser(re);
                getEntry();
            } else {
                console.log("No user data found");
                // Handle case when no userToken exists, e.g., set default user or redirect to login
            }
        } catch (error) {
            console.error("Error retrieving user data", error);
        }
    }
    async function getRecents(searchTerm, email) {
        let res = await getLast30DaysData(searchTerm, user?.email);

        if (res) {
            setItems(res.reverse());
        }
    }
    async function getEntry() {
        let res = await fetchalldiary(user?.email);
        if (res) setEntry(res);
    }

    useEffect(() => {
        getRecents(searchTerm, user?.email);
    }, [searchTerm]);
    useEffect(() => {
        initUser();
    }, []);
    useEffect(() => {
        getRecents("", user?.email);
        getEntry();
    }, [user]);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        // Simulating an API call or async task
        setTimeout(() => {
            initUser();

            setRefreshing(false); // Stop refreshing after the task is complete
        }, 2000); // Adjust the time according to your needs
    }, []);
    const theme = useColorScheme();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={0}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
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
                        <Text
                            numberOfLines={1}
                            style={[styles.headerTitle, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}
                        >
                            Profile
                        </Text>

                        <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
                            <Menu
                                visible={visible}
                                anchor={
                                    <FeatherIcon
                                        color={theme === "dark" ? darkTheme.color : lightTheme.color}
                                        onPress={() => setVisible(true)}
                                        name="more-vertical"
                                        size={24}
                                    />
                                }
                                onRequestClose={() => {
                                    setVisible(false);
                                }}
                                style={{ backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground }}
                            >
                                <MenuItem
                                    style={{ color: theme === "dark" ? darkTheme.color : lightTheme.color }}
                                    onPress={() => {
                                        router.push("/editProfile");
                                    }}
                                >
                                    <Text style={{ color: theme === "dark" ? darkTheme.color : lightTheme.color }}> Edit Profile</Text>
                                </MenuItem>
                                <MenuItem
                                    style={{ color: theme === "dark" ? darkTheme.color : lightTheme.color }}
                                    onPress={() => {
                                        actionSheetRef.current?.show();
                                    }}
                                >
                                    <Text style={{ color: "red" }}> Log out</Text>
                                </MenuItem>
                                {/* <MenuItem
                                    style={{ color: theme === "dark" ? darkTheme.color : lightTheme.color }}
                                    onPress={async () => {
                                        try {
                                            await deleteTables();
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    <Text style={{ color: theme === "dark" ? darkTheme.color : lightTheme.color }}> delete tables</Text>
                                </MenuItem> */}
                                <MenuItem
                                    style={{ color: theme === "dark" ? darkTheme.color : lightTheme.color }}
                                    onPress={() => {
                                        Alert.alert(
                                            "Delete data?", // Title
                                            "All of your data will be deleted, are you sure to continue ?", // Message
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
                                                            await deleteUserData(user?.email);
                                                            setVisible(false);
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
                                    <Text style={{ color: "red" }}> Delete Data</Text>
                                </MenuItem>
                            </Menu>
                        </View>
                    </View>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing} // Controls whether the spinner is active
                                onRefresh={onRefresh} // Triggered when the user pulls to refresh
                                tintColor="#39B54A" // Customize the color of the spinner
                                // Customize the title text color
                                colors={["#22C55E"]}
                            />
                        }
                    >
                        <View style={styles.content}>
                            <View
                                style={[
                                    styles.profile,
                                    { backgroundColor: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor },
                                ]}
                            >
                                <Text style={styles.sectionTitle}>Account</Text>
                                <View style={styles.profileTop}>
                                    <View style={styles.avatar}>
                                        <Image
                                            alt=""
                                            source={{
                                                uri: user?.avatarUrl,
                                            }}
                                            style={styles.avatarImg}
                                        />

                                        <View style={styles.avatarNotification} />
                                    </View>

                                    <View style={styles.profileBody}>
                                        <Text
                                            style={[styles.profileTitle, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}
                                        >
                                            {user?.name}
                                        </Text>

                                        <Text style={styles.profileSubtitle}>
                                            <Text style={{ color: "" }}>{user?.email}</Text>
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.profileDescription}>{user?.bio}</Text>

                                <View style={styles.profileTags}>
                                    {/* {tags.map((tag, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                >
                                    <Text style={styles.profileTagsItem}>#{tag}</Text>
                                </TouchableOpacity>
                            ))} */}
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.stats,
                                    { backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground },
                                ]}
                            >
                                {stats.map(({ label, value }, index) => (
                                    <View key={index} style={[styles.statsItem, index === 0 && { borderLeftWidth: 0 }]}>
                                        <Text style={styles.statsItemText}>{label}</Text>

                                        <Text
                                            style={[styles.statsItemValue, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}
                                        >
                                            {value}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View style={[styles.contentActions, {}]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push("/editProfile");
                                    }}
                                    style={{ flex: 1, paddingHorizontal: 6 }}
                                >
                                    <View
                                        style={[
                                            styles.btn,
                                            {
                                                color: theme == "dark" ? darkTheme.color : lightTheme.color,
                                                backgroundColor:
                                                    theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.btnText, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}>
                                            Edit Profile
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        router.navigate("/(tabs)/settings");
                                    }}
                                    style={{ flex: 1, paddingHorizontal: 6 }}
                                >
                                    <View
                                        style={[
                                            styles.btn,
                                            {
                                                color: theme == "dark" ? darkTheme.color : lightTheme.color,
                                                backgroundColor:
                                                    theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.btnText, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}>
                                            Settings
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.list}>
                            <View style={styles.listHeader}>
                                <Text style={[styles.listTitle, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}>
                                    Recents
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                >
                                    {/* <Text style={styles.listAction}>View All</Text> */}
                                    <View
                                        style={[
                                            styles.search,
                                            {
                                                backgroundColor:
                                                    theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                            },
                                        ]}
                                    >
                                        <View style={styles.searchIcon}>
                                            <FeatherIcon color="#778599" name="search" size={17} />
                                        </View>

                                        <TextInput
                                            autoCapitalize="words"
                                            onChangeText={(t) => setSearchTerm(t)}
                                            value={searchTerm}
                                            autoComplete="name"
                                            placeholder="Search..."
                                            placeholderTextColor="#778599"
                                            style={[styles.searchControl, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={styles.listContent} horizontal={true} showsHorizontalScrollIndicator={false}>
                                {items.map(({ data, dateinfo, year }, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            router.push(`/editOld?data=${dateinfo}`, {});
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.card,
                                                {
                                                    backgroundColor:
                                                        theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground,
                                                },
                                            ]}
                                        >
                                            <View style={styles.cardTop}>
                                                <View style={styles.cardIcon}>
                                                    <FeatherIcon color="#000" name={"book"} size={24} />
                                                </View>

                                                <View style={styles.cardBody}>
                                                    <Text
                                                        style={[
                                                            styles.cardTitle,
                                                            { color: theme == "dark" ? darkTheme.color : lightTheme.color },
                                                        ]}
                                                    >
                                                        {formatDate(dateinfo) || dateinfo}
                                                    </Text>

                                                    <Text numberOfLines={1} style={styles.cardSubtitle}>
                                                        {data}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.cardFooter}>
                                                <Text style={styles.cardFooterText}>{}</Text>

                                                <Text style={styles.cardFooterText}>{year}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.list}>
                            <View style={styles.listHeader}>
                                <Text style={[styles.listTitle, { color: theme == "dark" ? darkTheme.color : lightTheme.color }]}>
                                    Activity
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        setShowTimeline(!showTimeline);
                                    }}
                                >
                                    <Text style={styles.listAction}>{showTimeline ? "Graph  View" : "Graph  View"}</Text>
                                </TouchableOpacity>
                            </View>

                            <ContributionGraph
                                values={prepareDataForContributionGraph(entry?.map((item) => item.dateinfo))}
                                endDate={new Date()} // Set the end date to match your graph data
                                numDays={100} // Number of days you want to show
                                width={Dimensions.get("window").width}
                                height={220}
                                chartConfig={{
                                    ...chartConfig,
                                    backgroundColor: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor,
                                    backgroundGradientFrom: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor,
                                    backgroundGradientTo: theme === "dark" ? darkTheme.backgroundColor : lightTheme.backgroundColor,
                                }}
                                horizontal={true}
                                style={{ paddingTop: 15 }}
                            />

                            {}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <ActionSheet
                    ref={actionSheetRef}
                    containerStyle={{ backgroundColor: theme === "dark" ? darkTheme.contentBackground : lightTheme.contentBackground }}
                >
                    <Text style={[styles.actionHeadding, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>
                        Are You Sure To log out ?
                    </Text>
                    <View style={styles.actionWrap}>
                        <TouchableOpacity
                            onPress={() => {
                                AsyncStorage.removeItem("userToken");
                                setUserToken(null);
                                actionSheetRef.current?.hide();
                            }}
                        >
                            <Text style={styles.actionBtnCnl}>ok</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
                            <Text style={[styles.actionBtn, { color: theme === "dark" ? darkTheme.color : lightTheme.color }]}>cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const chartConfig = {
    backgroundColor: "#f8f8f8",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#f8f8f8",

    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 144, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 144, 0, ${opacity})`,
    style: {
        /// borderRadius: 16,
    },
};
function formatDate(dateString) {
    const date = new Date(dateString); // Parse the input date string
    const day = date.getDate(); // Get the day of the month
    const month = date.toLocaleString("default", { month: "long" }); // Get the full month name
    const year = date.getFullYear(); // Get the full year

    // Function to get the day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return "th"; // 11th, 12th, 13th are special
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    // Format the date string in '10th July 2045' format
    return `${day}${getDaySuffix(day)} ${month} ${year}`;
}
const prepareDataForContributionGraph = (dates) => {
    let graphData = [];

    // Regular expression to check if a date is in the format 'yyyy-mm-dd'
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Loop through the dates and only add valid ones
    dates.forEach((date) => {
        // Check if the date matches the 'yyyy-mm-dd' format using regex
        if (dateRegex.test(date)) {
            const dateObj = new Date(date);
            const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj
                .getDate()
                .toString()
                .padStart(2, "0")}`;
            graphData.push({
                date: formattedDate,
                count: 1, // You can adjust this count based on your activity data
            });
        } else {
        }
    });

    return graphData;
};

const styles = StyleSheet.create({
    /** Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 0,
        borderColor: "#e3e3e3",
    },
    actionBtn: {
        textAlign: "center",
        margin: 10,
        fontSize: 16,
    },
    actionBtnCnl: {
        color: "red",
        textAlign: "center",
        margin: 15,
        fontSize: 16,
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
        marginTop: 20,

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

        marginTop: 15,
    },
    /** Search */
    search: {
        position: "relative",
        marginHorizontal: 10,
        backgroundColor: "#F0F0F0",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 255,
    },
    searchIcon: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: 34,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },
    searchControl: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        paddingLeft: 34,
        width: "80%",
        fontSize: 16,
        fontWeight: "500",
    },
    /** Content */
    content: {
        paddingTop: 5,
        paddingHorizontal: 24,
    },
    contentActions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
        marginHorizontal: -6,
        marginBottom: 0,
    },
    /** Profile */
    profile: {
        padding: 4,
        paddingBottom: 10,
        backgroundColor: "#f8f8f8",
        marginBottom: 4,
        borderRadius: 4,
    },
    profileTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    profileBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        paddingLeft: 16,
    },
    profileTitle: {
        fontSize: 28,
        fontWeight: "bold",
        lineHeight: 32,
        color: "gray",
        marginBottom: 6,
        letterSpacing: 0.33,
        fontWeight: "500",
        className: "header",
    },
    profileSubtitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#778599",
    },
    profileDescription: {
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
        color: "#778599",
    },
    profileTags: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    profileTagsItem: {
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 18,
        color: "#266ef1",
        marginRight: 4,
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
    /** Avatar */
    avatar: {
        position: "relative",
    },
    avatarImg: {
        width: 80,
        height: 80,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: "#266ef1",
    },
    avatarNotification: {
        position: "absolute",
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: "#fff",
        bottom: 0,
        right: -2,
        width: 21,
        height: 21,
        backgroundColor: "#22C55E",
    },
    /** Stats */
    stats: {
        backgroundColor: "#fff",
        flexDirection: "row",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#90a0ca",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 1,
    },
    statsItem: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        borderLeftWidth: 1,
        borderColor: "rgba(189, 189, 189, 0.32)",
    },
    statsItemText: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 18,
        color: "#778599",
        marginBottom: 5,
    },
    statsItemValue: {
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 20,
        color: "#121a26",
    },
    /** Button */
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: "transparent",
        borderColor: "#266EF1",
    },
    btnText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
    },
    btnPrimary: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 2,
        backgroundColor: "#266EF1",
        borderColor: "#266EF1",
    },
    btnPrimaryText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "700",
        color: "#fff",
    },
    /** List */
    list: {
        marginTop: 16,
    },
    listHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 22,
        color: "#121a26",
    },
    listAction: {
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
        color: "#778599",
    },
    listContent: {
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    /** Card */
    card: {
        width: CARD_WIDTH,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: "#fff",
        marginHorizontal: 6,
        shadowColor: "#90a0ca",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 1,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 9999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eff1f5",
    },
    cardBody: {
        paddingLeft: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 18,
        color: "#121a26",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
        color: "#778599",
        textOverflow: "elipsis",
        maxWidth: 180,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
    },
    cardFooterText: {
        fontSize: 13,
        fontWeight: "500",
        lineHeight: 18,
        color: "#778599",
    },
});
