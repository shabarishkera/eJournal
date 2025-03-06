import React, { useState } from "react";
import { fetchalldiary } from "@/components/backend/database";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Agenda } from "react-native-calendars";
import { useFocusEffect, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet, useColorScheme, ToastAndroid } from "react-native";

export default function Home() {
    const theme = useColorScheme();
    const [items, setitems] = useState({});
    const [isLoaded, setIsLoaded] = useState(false); // Flag to check if data is loaded
    const router = useRouter();
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [selected, setSelected] = useState(formatDate(new Date()));
    // Fetch data function
    async function inititems() {
        const result = await fetchalldiary();

        // Define the type for the items object where the keys are date strings and values are arrays of EventItem objects

        let tempitem = {};
        for (let row of result) {
            const array = row;
            tempitem[`${row.dateinfo}`] = [{ name: row.data, date: row.dateinfo, height: 50 }];
        }
        setitems(tempitem);

        setIsLoaded(true); // Mark as loaded
    }

    // Prevent continuous fetching with useFocusEffect
    useFocusEffect(
        React.useCallback(() => {
            inititems(); // Call inititems only if not already loaded
        }, [isLoaded]) // Dependency on isLoaded to ensure it only runs once
    );

    // Format Date function

    const lightTheme = {
        backgroundColor: "#f5f5f5",
        calendarBackground: "#ffffff",
        textSectionTitleColor: "#4f6d7a",
        todayTextColor: "#00adf5",
        dayTextColor: "#2d4150",
        monthTextColor: "#2d4150",
        indicatorColor: "#00adf5",
        selectedDayBackgroundColor: "#00adf5",
        selectedDayTextColor: "#ffffff",
        todayButtonTextColor: "#00adf5",
        arrowColor: "#00adf5",
    };

    const darkTheme = {
        backgroundColor: "#121212",
        calendarBackground: "#121212",
        textSectionTitleColor: "#2d4150",
        todayTextColor: "#00adf5",
        dayTextColor: "#ffffff",
        monthTextColor: "#ffffff",
        indicatorColor: "#00adf5",
        selectedDayBackgroundColor: "#00adf5",
        selectedDayTextColor: "#ffffff",
        todayButtonTextColor: "#00adf5",
        arrowColor: "#00adf5",
        reservationsBackgroundColor: "#121212",
        // "stylesheet.agenda.main": {
        //     reservations: {
        //         backgroundColor: "#2d4150",
        //     },
        // },
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Agenda
                        selected={formatDate(new Date())}
                        rowHasChanged={(r1, r2) => r1.name != r2.name}
                        scrollEnabled={true}
                        items={items}
                        // renderEmptyDate={(item) => {
                        //     return (
                        //         <TouchableOpacity
                        //             onPress={() => {
                        //                 console.log(selected);
                        //                 router.replace(`/addOld?data=${item.date}`);
                        //             }}
                        //             style={styles.item}
                        //         >
                        //             <Text style={styles.itemText}>No data ..Click to add ..</Text>
                        //         </TouchableOpacity>
                        //     );
                        // }}
                        loadItemsForMonth={(day) => {}}
                        renderEmptyData={(item) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push(`/editOld?data=${selected}`);
                                    }}
                                    style={[
                                        styles.itemEmtpy,
                                        {
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: theme === "dark" ? darkTheme.backgroundColor : lightTheme.calendarBackground,
                                        },
                                    ]}
                                >
                                    <Text style={styles.itemText}>No Data Avalialble...Click to add ..</Text>
                                </TouchableOpacity>
                            );
                        }}
                        futureScrollRange={1}
                        pastScrollRange={1}
                        renderItem={(item) => (
                            <TouchableOpacity
                                onPress={() => {
                                    router.push(`/editOld?data=${item.date}`, {});
                                }}
                                style={[
                                    styles.item,
                                    {
                                        justifyContent: "center",
                                        alignItems: "center",

                                        backgroundColor: theme === "dark" ? darkTheme.textSectionTitleColor : lightTheme.calendarBackground,
                                    },
                                ]}
                            >
                                <Text style={[styles.itemText, { color: theme === "dark" ? "#fff" : "#888" }]}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        onDayPress={(day) => {
                            setSelected(day.dateString);
                        }}
                        theme={theme === "dark" ? darkTheme : lightTheme}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    itemEmtpy: {
        padding: 10,
    },
    itemText: {
        color: "#888",
        fontSize: 16,
    },
});
