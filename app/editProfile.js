import React, { useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
export default function editProfile(prop) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [password, setPassword] = useState("");

    async function initDetails() {
        try {
            const res = await AsyncStorage.getItem("userToken");

            if (res !== null) {
                let parsedRes = JSON.parse(res);

                setName(parsedRes.name);
                setEmail(parsedRes.email);
                setBio(parsedRes.bio);
                setAvatar(parsedRes.avatarUrl);
                setPassword(parsedRes.password);
            } else {
                console.log("No user data found");
                // Handle case when no userToken exists, e.g., set default user or redirect to login
            }
        } catch (error) {
            console.error("Error retrieving user data", error);
        }
    }
    useEffect(() => {
        initDetails();
    }, []);
    const handleSubmit = async () => {
        await AsyncStorage.setItem(
            "userToken",
            JSON.stringify({
                email: email,
                password: password,
                name: name,
                bio: bio,
                avatarUrl: avatar,
            })
        );
        router.navigate("(tabs)/explore");
    };
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image style={styles.avatar} source={{ uri: avatar }} />
                <TouchableOpacity style={styles.changeAvatarButton} onPress={pickImage}>
                    <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} placeholder="Enter Name" value={name} onChangeText={setName} />
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={setEmail} />
                <Text style={styles.label}>Bio</Text>
                <TextInput style={styles.input} placeholder="Enter Bio" value={bio} onChangeText={setBio} />
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit({ name, email, bio, avatar })}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    form: {
        width: "80%",
    },
    label: {
        marginTop: 20,
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#1E90FF",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "100%",
        backgroundColor: "#39B54A",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
    avatarContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    changeAvatarButton: {
        marginTop: 10,
    },
    changeAvatarButtonText: {
        color: "#1E90FF",
        fontSize: 18,
    },
});
