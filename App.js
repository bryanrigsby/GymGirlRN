import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

//navigator
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//firebase
import firebase from 'firebase';
import { firebaseConfig } from './backend/server';
if(!firebase.apps.length){// makes sure that firebase doesn't initialize more than once
  firebase.initializeApp(firebaseConfig);
}

//Screens
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChooseWorkoutTypeScreen from './screens/ChooseWorkoutTypeScreen';
import CardioScreen from './screens/CardioScreen';
import StrengthScreen from './screens/StrengthScreen';
import MotivationalScreen from './screens/MotivationalScreen';


// var data = firebase.database().ref(); 
// data.on('value', snap => console.log(snap.val()));

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={
          {
            headerTitle: 'GymGirl',
            headerStyle: {
              backgroundColor: '#ffaed7',
              borderBottomColor: 'black',
              borderBottomWidth: 2
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              alignSelf: 'flex-end' 
            }
          }
        }
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Loading"
          component={LoadingScreen}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="ChooseWorkoutType" 
          component={ChooseWorkoutTypeScreen} 
        />
        <Stack.Screen 
          name="Cardio" 
          component={CardioScreen} 
        />
        <Stack.Screen 
          name="Strength" 
          component={StrengthScreen} 
        />
        <Stack.Screen 
          name="Motivational" 
          component={MotivationalScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
