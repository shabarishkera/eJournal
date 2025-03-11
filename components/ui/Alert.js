import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";
import { BlurView } from "expo-blur";
export default function Alert() {
    const [visible, setVisible] = useState(true);
    const blurComponentIOS = <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={50} />;
    const showDialog = () => {
        //setVisible(true);
    };

    const handleCancel = () => {
        // setVisible(false);
    };

    const handleDelete = () => {
        // The user has pressed the "Delete" button, so here you can do your own logic.
        // ...Your logic
        // setVisible(false);
    };

    return (
        <View style={styles.container}>
            <Dialog.Container visible={true} blurComponentIOS={blurComponentIOS}>
                <Dialog.Title>Account delete</Dialog.Title>
                <Dialog.Description>Do you want to delete this account? You cannot undo this action.</Dialog.Description>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Delete" onPress={handleDelete} />
            </Dialog.Container>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
