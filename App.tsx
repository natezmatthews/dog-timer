import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./redux/redux";
import { setDelta, setStart } from "./redux/settingsSlice";
import {
    registerForPushNotificationsAsync,
    schedulePushNotification,
} from "./src/notifications";
import nSecondsFromNow from "./src/nSecondsFromNow";
import Setting from "./src/Setting";
import useTimer from "./src/useTimer/useTimer";

function Main() {
    const dispatch = useDispatch();
    
    const startStr = useSelector((state: RootState) => state.settings.start);
    const deltaStr = useSelector((state: RootState) => state.settings.delta);
    const start = parseFloat(startStr);
    const delta = parseFloat(deltaStr);
    
    const [curr, setCurr] = useState<number>(start);

    useEffect(() => {
        setCurr(start);
    }, [start]);

    const { seconds, isRunning, pause, resume, restart } = useTimer({
        expiryTimestamp: nSecondsFromNow(curr),
        onExpire: () => {
            schedulePushNotification();
            setCurr((prev) => {
                const next = prev + delta;
                restart(nSecondsFromNow(next));
                return next;
            });
        },
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.countdown}>{seconds}</Text>
            <Button
                title={isRunning ? "Pause" : "Resume"}
                onPress={isRunning ? pause : resume}
            />
            <Setting
                title="Starting interval"
                value={startStr}
                onChangeText={(text) => dispatch(setStart(text))}
            />
            <Setting
                title="Increase each time"
                value={deltaStr}
                onChangeText={(text) => dispatch(setDelta(text))}
            />
        </ScrollView>
    );
}

export default function App() {
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    countdown: {
        fontSize: 30,
    },
});
