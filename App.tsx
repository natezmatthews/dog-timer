import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './redux/redux';
import { setExponent, setLowBound, setNumRounds, setPb } from './redux/settingsSlice';

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
  const exponent = useSelector((state: RootState) => state.settings.exponent)
  const dispatch = useDispatch();

  return (<SafeAreaView>
    <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    <TextInput
      value={pb}
      onChangeText={(newText) => dispatch(setPb((newText)))}
      style={styles.input}
    />
    <TextInput
      value={numRounds}
      onChangeText={(newText) => dispatch(setNumRounds(newText))}
      style={styles.input}
    />
    <TextInput
      value={lowBound}
      onChangeText={(newText) => dispatch(setLowBound((newText)))}
      style={styles.input}
    />
    <TextInput
      value={exponent}
      onChangeText={(newText) => dispatch(setExponent((newText)))}
      style={styles.input}
    />
  </SafeAreaView>)
}

function Home({ navigation }) {
  const pb = useSelector((state: RootState) => state.settings.pb)
  const lowBound = useSelector((state: RootState) => state.settings.lowBound)
  const numRounds = useSelector((state: RootState) => state.settings.numRounds)
  const exponent = useSelector((state: RootState) => state.settings.exponent)
  const [volley, setVolley] = useState<number>(0);
  const [plan, setPlan] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(10);
  const dispatch = useDispatch()

  useEffect(() => {
    setPlan(() => {
      const newPlan = simulator(parseInt(pb, 10), parseInt(numRounds, 10), parseFloat(exponent), parseFloat(lowBound));
      setIndex(0)
      setSeconds(Math.ceil(newPlan[0]))
      return newPlan;
    });
  }, [pb, numRounds, volley])

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds => seconds - 1)
      }
      if (seconds === 0) {
        if (index + 1 === plan.length) {
          dispatch(setPb((parseInt(pb, 10) * 1.2).toString()))
          setVolley(volley => volley + 1)
        } else {
          setIndex(index => {
            const nextIndex = index + 1;
            setSeconds(Math.ceil(plan[nextIndex]))
            return nextIndex
          })
        }
      }
    }, 1000)
    return () => clearInterval(myInterval)
  }, [seconds]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.column}>
        <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Text>{seconds}</Text>
      <Button title={"Start"} onPress={() => setVolley(volley => volley + 1)} />
      <TextInput 
        keyboardType='numeric'
        value={pb.toString()}
        onChangeText={text => setPb(parseInt(text.replace(/[^0-9]/g, '')))}
      />
      {/* <Text>{`Personal Best: ${pb}`}</Text> */}
      <Text>{`Num Rounds: ${numRounds}`}</Text>
      <Text>{`Volley #: ${volley}`}</Text>
      <Text>{`Seconds: ${seconds}`}</Text>
      </View>
      
      <View style={styles.column}>
        {plan.map((tbr, i) =>
          <Text key={i}>{`${index === i ? '-> ' : ''}${Math.ceil(tbr)}`}</Text>
        )}
      </View>
    </ScrollView>);
}

function simulator(personalBest: number, numRewardsPerVolley: number, exponent: number, lowBound: number): number[] {
  const tbrs = [];
  for (let index = 1; index <= numRewardsPerVolley; index++) {
    const percentThroughRound = index / numRewardsPerVolley;
    const percentOfPersonalBest = percentThroughRound * personalBest;
    tbrs.push(
      randomWithinBounds(percentOfPersonalBest * lowBound, percentOfPersonalBest, exponent - percentThroughRound)
    )
  }
  tbrs.push(personalBest)
  return tbrs;
}

function randomWithinBounds(min: number, max: number, exponent: number): number {
  return Math.pow(
    randBetween(
      Math.pow(min, 1 / exponent),
      Math.pow(max, 1 / exponent)
    ),
    exponent);
}

function randBetween(min: number, max: number): number { // min and max included 
  return Math.random() * (max - min) + min
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
});
