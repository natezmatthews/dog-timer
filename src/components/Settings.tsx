import * as React from 'react';
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/redux";
import {
    setFloor,
    setLowBound,
    setNoise,
    setNumRounds,
    setPb
} from "../../redux/settingsSlice";
import Setting from "./Setting";

export default function Settings({ navigation }) {
    const pb = useSelector((state: RootState) => state.settings.pb);
    const lowBound = useSelector((state: RootState) => state.settings.lowBound);
    const numRounds = useSelector(
        (state: RootState) => state.settings.numRounds
    );
    const noise = useSelector((state: RootState) => state.settings.noise);
    const floor = useSelector((state: RootState) => state.settings.floor);
    const dispatch = useDispatch();

    return (
        <SafeAreaView>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate("Home")}
            />
            <Setting
                title={"Personal best"}
                value={pb}
                onChangeText={(newText) => dispatch(setPb(newText))}
            />
            <Setting
                title={"Num rounds"}
                value={numRounds}
                onChangeText={(newText) => dispatch(setNumRounds(newText))}
            />
            <Setting
                title={"Lows are x percent of highs"}
                value={lowBound}
                onChangeText={(newText) => dispatch(setLowBound(newText))}
            />
            <Setting
                title={"Range of noise"}
                value={noise}
                onChangeText={(newText) => dispatch(setNoise(newText))}
            />
            <Setting
                title={"Lowest floor"}
                value={floor}
                onChangeText={(newText) => dispatch(setFloor(newText))}
            />
        </SafeAreaView>
    );
}
