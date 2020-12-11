import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, useWindowDimensions } from 'react-native';
import {useState, useEffect, useRef} from 'react';
import Slider from '@react-native-community/slider';
import firebase from 'firebase';

export default function CardioScreen({route, navigation}){
  
  const {picture, userId} = route.params;
  const category = 'cardio';
  const firstRender = useRef(true);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [descriptionState, setDescriptionState] = useState();
  const [durationState, setDurationState] = useState(60);

  useEffect(() => {
    let mounted = true;
    if(firstRender.current) {
      firstRender.current = false
      return
    }

    if(mounted){
      setDisabled(formValidation())
    }
    
    return () => mounted = false;

  }, [descriptionState, durationState])

  const formValidation = () => {
    if(descriptionState === ""){
      setError('Please provide a description')
      return true
    }
    else{
      setError(null)
      return false
    }
  }

  const updateValue = (value, field) =>{
    if(field == 'description'){
      setDescriptionState(value)
    }
    else if(field == 'duration'){
      setDurationState(value)
    }
    else{
      console.log('error')
    }
  }

  const submit = () => {
    let collection={}
    collection.category = category,
    collection.description = descriptionState,
    collection.duration = durationState,
    collection.user_id = userId

    console.log("workoutState: " + JSON.stringify(collection));

      firebase
        .database()
        .ref('/exercises/')
        .push({
          category: collection.category,
          description: collection.description,
          duration: collection.duration,
          user_id: collection.user_id
        })

    navigation.navigate('Motivational', {
      picture: picture
    })
    
  }
   
  
  return (
      <SafeAreaView style={[styles.container, {minHeight: Math.round(useWindowDimensions().height)}]}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Image
              style={styles.image}
              source={{
              uri: picture,
              }}
          />
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
            underlayColor='#fff'>
              <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => firebase.auth().signOut()
              .then(function() {
                navigation.navigate("Login");
                console.log('Sign-out successful');
            })
              .catch(err => console.log("logout error: " + JSON.stringify(err)))}
            underlayColor='#fff'>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.welcomeMessage}>
          <Text style={styles.welcomeMessageText}>Cardio Workout</Text>
        </View>

        <View style={styles.body}>
          <ScrollView>
          <View style={styles.bodyItem}>
            <Text style={styles.bodyItemText}>What did you do?</Text>
            <TextInput 
              style={styles.textInput} 
              autoCapitalize={"characters"}
              autoFocus={true}
              clearButtonMode={"always"}
              maxLength={25}
              returnKeyType={"done"}
              textAlign={'center'}
              onChangeText={(value) => updateValue(value, 'description')}
              value={descriptionState}
            />
            { error && <Text style={styles.errorText}>{error}</Text> }
          </View>
          <View style={styles.bodyItem}>
            <Text style={styles.bodyItemText}>How long?</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={120}
              minimumTrackTintColor='#00bfff'
              maximumTrackTintColor="#FFFFFF"
              step={1}
              tapToSeek={true}
              value={durationState}
              onValueChange={(value) => updateValue(value, 'duration')}
            />
            <Text style={styles.bodyItemText}> {durationState} minutes</Text>
          </View>
          <View style={[styles.bodyItem,  {backgroundColor: '#00bfff'}]}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => submit()}
              disabled={disabled}
              underlayColor='#fff'>
                <Text style={styles.bodyItemText}>tap to submit workout</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffaed7',
    },
    image: {
      flex: 2,
      width: 100,
      height: 100,
    },
    homeButton:{
      flex: 2,
      height: 100,
      backgroundColor:'#00bfff',
      justifyContent: 'center',
    },
    homeButtonText:{
      color:'#fff',
      textAlign:'center',
      fontWeight: 'bold',
    },
    signOutButton:{
      flex: 2,
      height: 100,
      backgroundColor:'red',
      justifyContent: 'center',
    },
    signOutText:{
      color:'#fff',
      textAlign:'center',
      fontWeight: 'bold',
    },
    welcomeMessage: {
      flex: 1, 
      paddingRight: 10,
      paddingLeft: 10,
      alignItems: 'center', 
      justifyContent: 'center',
    },
    welcomeMessageText: {
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 20
    },
    body: {
      flex: 4,
      padding: 10,
    },
    bodyItem: {
      flex: 3,
      marginBottom: 10,
      padding: 10,
      borderStyle: 'solid',
      borderWidth: 5,
      borderColor: '#00bfff',
      borderRadius: 10,
      justifyContent: 'center',
    },
    bodyItemText: {
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center',
      fontSize: 20
    },
    textInput: {
      marginTop: 10,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 10,
      color: '#00bfff',
      fontWeight: 'bold',
      fontSize: 20
    },
    slider: {
      width: 300,
      height: 40,
      alignSelf: 'center',
    },
    submitButton: {
      padding: 20
    },
    errorText: {
      fontSize: 12,
      color: 'red',
      alignSelf: 'center'
    }
})