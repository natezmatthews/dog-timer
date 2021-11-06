import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./redux/redux";
import { setPb } from "./redux/settingsSlice";
import Settings from "./src/components/Settings";
import makeAPlan from "./src/makeAPlan";
import { registerForPushNotificationsAsync, schedulePushNotification } from './src/notifications';
import nSecondsFromNow from "./src/nSecondsFromNow";
import useTimer from "./src/useTimer/useTimer";

const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

function Home({ navigation }) {
    const pb = useSelector((state: RootState) => state.settings.pb);
    const lowBound = useSelector((state: RootState) => state.settings.lowBound);
    const numRounds = useSelector(
        (state: RootState) => state.settings.numRounds
    );
    const noise = useSelector((state: RootState) => state.settings.noise);
    const floor = useSelector((state: RootState) => state.settings.floor);

    const [volley, setVolley] = useState<number>(0);
    const [plan, setPlan] = useState<number[]>([]);
    const [index, setIndex] = useState<number>(0);
    const dispatch = useDispatch();

    const { seconds, isRunning, pause, resume, restart } = useTimer({
        expiryTimestamp: nSecondsFromNow(10),
        onExpire: () => {
            schedulePushNotification();
            if (index + 1 === plan.length) {
                const newPersonalBest = parseInt(pb, 10) * 1.2;
                dispatch(setPb(newPersonalBest.toString()));
                setVolley((volley) => volley + 1);
            } else {
                setIndex((index) => {
                    const nextIndex = index + 1;
                    restart(nSecondsFromNow(Math.ceil(plan[nextIndex])));
                    return nextIndex;
                });
            }
        },
    });

    useEffect(() => {
        setPlan(() => {
            const newPlan = makeAPlan(
                parseInt(pb, 10),
                parseInt(numRounds, 10),
                parseFloat(lowBound),
                parseFloat(noise),
                parseInt(floor, 10)
            );
            setIndex(0);
            restart(nSecondsFromNow(Math.ceil(newPlan[0])));
            return newPlan;
        });
    }, [pb, numRounds, lowBound, noise, floor]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.column}>
                {plan.map((tbr, i) => (
                    <Text key={i}>{`${index === i ? "-> " : ""}${Math.ceil(
                        tbr
                    )}`}</Text>
                ))}
            </View>

            <View style={styles.column}>
                <Button
                    title="Go to Settings"
                    onPress={() => navigation.navigate("Settings")}
                />
                <Text style={styles.countdown}>{seconds}</Text>
                <Button
                    title={isRunning ? "Pause" : "Resume"}
                    onPress={isRunning ? pause : resume}
                />
                <Text>{`Volley #: ${volley}`}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    column: {
        width: "50%",
    },
    countdown: {
        fontSize: 30,
    },
});
