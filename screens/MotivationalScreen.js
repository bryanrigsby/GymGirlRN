import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

export default function MotivationalScreen({route, navigation}){

  const {userId, username, picture} = route.params;

  const [quoteState, setQuoteState] = useState('As long as every generation rises to its challenges and stands up in defense of liberty - as Americans have done in the past and as our men and women continue to do today - our nation will remain free and strong.'
  );
  const [authorState, setAuthorState] = useState(' - Doc Hastings')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if(mounted){
      getQuote();

    }
    mounted = false;

    const reroute = setTimeout(() => {
      rerouteToHome();
    }, 10000);
    
    
    return () => clearTimeout(reroute);

    
  }, []);

  const rerouteToHome = () => {
    navigation.navigate('Home')
  }

  const getQuote = () => {
    return fetch('https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json')
      .then((response) => response.json())
      .then((json) => {
          //console.log(json.quoteText)
          setQuoteState(json.quoteText)
          setAuthorState(json.quoteAuthor)
          setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      })
  }

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
              .catch(err => console.error("logout error: " + JSON.stringify(err)))}
            underlayColor='#fff'>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.welcomeMessage}>
          <Text style={styles.welcomeMessageText}>You did it {username}!!</Text>
        </View>

        {loading ? 
        <View style={styles.body}>
          <ActivityIndicator size='large' color="#00bfff" style={styles.activityIndicator} />  
        </View> :
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.bodyItem}>
              <Text style={styles.bodyItemText}>{quoteState} - {authorState}</Text>
            </View>
          </ScrollView>
        </View>
        }
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
      fontSize: 35
    },
    activityIndicator: {
      flex: 3,
      justifyContent: 'flex-start'
    },
    body: {
      flex: 4,
      padding: 10,
      alignItems: 'center'
    },
    bodyItem: {
      flex: 1,
      marginBottom: 10,
      padding: 10,
      borderStyle: 'solid',
      borderWidth: 5,
      borderColor: '#00bfff',
      borderRadius: 10,
      justifyContent: 'center',
      height: 400,
      width: 350,
      backgroundColor: '#00bfff'
    },
    bodyItemText: {
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center',
      fontSize: 25
    },


})