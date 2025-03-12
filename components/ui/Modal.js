import React, { useState } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import { BlurView } from "expo-blur";

export default function Modal({ onClose }) {
    return (
        <View style={styles.overlay}>
            <BlurView blurType="light" intensity={10} reducedTransparencyFallbackColor="white" />
            <Text style={styles.modalText}>This is a full-screen modal</Text>

            <Button title="Close" onPress={onClose} />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute", // Position the modal absolutely
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Semi-transparent background
        justifyContent: "center", // Center the content vertically
        alignItems: "center", // Center the content horizontally
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    modalContainer: {
        padding: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        width: "80%", // You can adjust this to make the modal smaller or larger
        maxWidth: 400,
        borderColor: "red",
        borderWidth: 3,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
});
