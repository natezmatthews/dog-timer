import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './redux/redux';
import { setFloor, setLowBound, setNoise, setNumRounds, setPb } from './redux/settingsSlice';
import makeAPlan from './src/makeAPlan';
import nSecondsFromNow from './src/nSecondsFromNow';
import useTimer from './src/useTimer/useTimer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Settings' component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

function Settings({ navigation }) {
  const pb = useSelector((state: RootState) => state.settings.pb)
  const lowBound = useSelector((state: RootState) => state.settings.lowBound)
  const numRounds = useSelector((state: RootState) => state.settings.numRounds)
  const noise = useSelector((state: RootState) => state.settings.noise)
  const floor = useSelector((state: RootState) => state.settings.floor)
  const dispatch = useDispatch();

  return (<SafeAreaView>
    <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    <Text>Personal best</Text>
    <TextInput
      value={pb}
      onChangeText={(newText) => dispatch(setPb((newText)))}
      style={styles.input}
    />
    <Text>Num rounds</Text>
    <TextInput
      value={numRounds}
      onChangeText={(newText) => dispatch(setNumRounds(newText))}
      style={styles.input}
    />
    <Text>Lows are x percent of highs</Text>
    <TextInput
      value={lowBound}
      onChangeText={(newText) => dispatch(setLowBound((newText)))}
      style={styles.input}
    />
    <Text>Range of noise</Text>
    <TextInput
      value={noise}
      onChangeText={(newText) => dispatch(setNoise((newText)))}
      style={styles.input}
    />
    <Text>Lowest floor</Text>
    <TextInput
      value={floor}
      onChangeText={(newText) => dispatch(setFloor((newText)))}
      style={styles.input}
    />
  </SafeAreaView>)
}

function Home({ navigation }) {
  const pb = useSelector((state: RootState) => state.settings.pb)
  const lowBound = useSelector((state: RootState) => state.settings.lowBound)
  const numRounds = useSelector((state: RootState) => state.settings.numRounds)
  const noise = useSelector((state: RootState) => state.settings.noise)
  const floor = useSelector((state: RootState) => state.settings.floor)
  
  const [volley, setVolley] = useState<number>(0);
  const [plan, setPlan] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(0);
  const dispatch = useDispatch()

  const {
    seconds,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: nSecondsFromNow(10), onExpire: () => {
    if (index + 1 === plan.length) {
      dispatch(setPb((
        parseInt(pb, 10) * 1.2).toString()))
      setVolley(volley => volley + 1)
    } else {
      setIndex(index => {
        const nextIndex = index + 1;
        restart(nSecondsFromNow(Math.ceil(plan[nextIndex])))
        return nextIndex
      })
    }
  } });

  useEffect(() => {
    setPlan(() => {
      const newPlan = makeAPlan(
        parseInt(pb, 10), 
        parseInt(numRounds, 10), 
        parseFloat(lowBound),
        parseFloat(noise),
        parseInt(floor, 10)
      );
      setIndex(0)
      restart(nSecondsFromNow(Math.ceil(newPlan[0])))
      return newPlan;
    });
  }, [pb, numRounds, volley])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.column}>
        {plan.map((tbr, i) =>
          <Text key={i}>{`${index === i ? '-> ' : ''}${Math.ceil(tbr)}`}</Text>
        )}
      </View>
      
      <View style={styles.column}>
        <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Text style={styles.countdown}>{seconds}</Text>
      <Button title={ isRunning ? "Pause" : "Resume"} onPress={
        isRunning ? pause : resume
      } />
      <Text>{`Volley #: ${volley}`}</Text>
      </View>
      
      
    </ScrollView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  column: {
    width: '50%'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  countdown: {
    fontSize: 30
  }
});
