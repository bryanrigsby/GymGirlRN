import React from 'react';
import { StyleSheet, Text, View, Button, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

export default function ChooseWorkoutTypeScreen({route, navigation}) {
    
  const {userId, username, picture} = route.params;
  
  return (
      <SafeAreaView style={styles.container}>
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
                //console.log('Sign-out successful');
            })
              .catch(err => console.log("logout error: " + JSON.stringify(err)))}
            underlayColor='#fff'>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.welcomeMessage}>
          <Text style={styles.welcomeMessageText}>Choose Workout Type</Text>
        </View>

        <View style={styles.body}>
          <TouchableOpacity
            style={styles.bodyButton}
            onPress={() => navigation.navigate('Cardio', {
              userId: userId,
              username: username,
              picture: picture
            })}
            underlayColor='#fff'>
              <Text style={styles.bodyButtonText}>Cardio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bodyButton}
            onPress={() => navigation.navigate('Strength', {
              userId: userId,
              username: username,
              picture: picture
            })}
            underlayColor='#fff'>
              <Text style={styles.bodyButtonText}>Strength</Text>
          </TouchableOpacity>
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
    bodyButton: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00bfff',
      marginBottom: 10,
      borderRadius: 15
    },
    bodyButtonText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  })