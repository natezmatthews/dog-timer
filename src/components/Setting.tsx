import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default function Setting({
    title,
    value,
    onChangeText,
}: {
    title: string;
    value: string;
    onChangeText: (text: string) => void;
}) {
    return (
        <View>
            <Text>{title}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
            />
        </View>
    );
}
