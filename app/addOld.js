import { Image, StyleSheet, Platform, Text, Button, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { addDiary } from "@/components/backend/database";
export default function addOld() {
    const theme = useColorScheme();
    const colortheme = Colors[theme];
    const router = useRouter();
    const [dateval, setDate] = useState(""); // State for holding the date
    const [diary, setDiary] = useState("");

    const [isloading, setIsLoading] = useState(false);
    const { data } = useLocalSearchParams();

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

    // Function to handle saving the diary entry
    const handleSave = async () => {
        if (dateval && diary) {
            setIsLoading(true);
            try {
                const res = await addDiary(dateval, new Date().getFullYear(), new Date().getDay().toString(), diary);
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
            <SafeAreaView style={{ flex: 1, height: "100%" }}>
                <View style={styles.container}>
                    <TextInput
                        editable={true}
                        multiline={true}
                        style={[
                            styles.TextInput,
                            {
                                backgroundColor: colortheme.background,
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

                    <TouchableOpacity disabled={isloading} onPress={handleSave} style={styles.saveBtn}>
                        <Text style={styles.saveText}>{"ADD"}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        alignItems: "center",
    },
    TextInput: {
        height: "85%",
        width: "95%",
        margin: 10,
        marginTop: 45,
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
});
