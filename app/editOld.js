import { Image, StyleSheet, Platform, Text, Button, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { editDiary, getDiaryByDate } from "@/components/backend/database";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function addOld() {
    const theme = useColorScheme();
    const colortheme = Colors[theme];
    const [editable, setEditable] = useState(false);
    const router = useRouter();
    const [dateval, setDate] = useState(""); // State for holding the date
    const [diary, setDiary] = useState("");

    const [isloading, setIsLoading] = useState(false);
    const { data } = useLocalSearchParams();

    const getTodaysDiary = async (date) => {
        console.log("getting diary for date", date);
        setDiary("");
        const res = await getDiaryByDate(date);

        if (res) {
            setDiary(res);
            setIsEdit(true);
            // Set the diary entry if available
        }
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
    useEffect(() => {
        if (dateval) {
            getTodaysDiary(dateval); // Fetch diary based on the date
        }
    }, [dateval]);
    // Function to handle saving the diary entry
    const handleSave = async () => {
        if (dateval && diary) {
            setIsLoading(true);
            try {
                const res = await editDiary(dateval, new Date().getFullYear(), new Date().getDay().toString(), diary);
                console.log(res);
            } catch (error) {
                console.log("Error occured ...!");
                console.log(error);
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
                    <View style={styles.editContainer}>
                        <AntDesign
                            onPress={() => {
                                setEditable(!editable);
                            }}
                            name={editable ? "closecircleo" : "edit"}
                            size={24}
                            color="black"
                        />
                    </View>

                    <TextInput
                        editable={editable}
                        multiline={true}
                        style={[
                            styles.TextInput,
                            {
                                backgroundColor: colortheme.background,
                                color: colortheme.text,
                                paddingHorizontal: 20,
                                elevation: 40,
                                opacity: editable ? 1 : 0.8,
                            },
                        ]}
                        value={diary}
                        placeholder="Journal your day ..."
                        placeholderTextColor="gray"
                        onChangeText={(phrasetext) => setDiary(phrasetext)}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity disabled={isloading} onPress={handleSave} style={styles.saveBtn}>
                        <Text style={styles.saveText}>{"EDIT"}</Text>
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
    editContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        padding: 10,
    },
    TextInput: {
        height: "80%",
        width: "95%",
        margin: 10,
        marginTop: 10,
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
        marginTop: 5,
        marginBottom: 10,
    },
    saveText: {
        color: "#ffffff",
        fontWeight: "800",
    },
});
