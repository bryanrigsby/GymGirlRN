import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

export default function HomeScreen({route, navigation}) {

  const {userId, username, picture} = route.params;
  const [exerciseCategory, setExerciseCategory] = useState();
  const [loading, setLoading] = useState(true);

  //console.log('userid:' +  userId);


  useEffect(() => {
    firebase
      .database()
      .ref("exercises")
      .on("value", snapshot => {
        const data = snapshot.val();
        if(snapshot.val()){
          //console.log("data: " + JSON.stringify(data));
          const categories = [];
          Object
            .keys(data)
            .forEach(obj => categories.push(data[obj]))
            //console.log('categories: ' + JSON.stringify(categories));
            setExerciseCategory(categories);
        }

        setLoading(false)
      });
  },[])

  const getDate = (timestamp) => {
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();

    var convDate = month + ' ' + day + ' ' + year;
    return convDate
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
            style={styles.addWorkoutButton}
            onPress={() => navigation.navigate('ChooseWorkoutType', {
              userId: userId,
              username: username,
              picture: picture
            })}
            underlayColor='#fff'>
              <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
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

        {loading ? 
        <View style={styles.welcomeMessage}>
          <Text style={styles.welcomeMessageText}>Hey {username}!</Text> 
          <ActivityIndicator size="large" color="#00bfff" style={styles.activityIndicator} />
        </View>
         : 
        <>
        <View style={styles.welcomeMessage}>
            {exerciseCategory && exerciseCategory.some(obj => userId == obj.user_id) ?
              <>
                <Text style={styles.welcomeMessageText}>Hey {username}!</Text> 
                <Text style={styles.welcomeMessageText}>  Check out your completed workouts!</Text> 
              </> :
              <>
                <Text style={styles.welcomeMessageText}>{username}!</Text>
                <Text style={styles.welcomeMessageText}>You haven't completed any workouts!</Text>
              </>
            }
        </View>
        

        <View style={styles.body}>
          <ScrollView >
          {exerciseCategory ? exerciseCategory.map((item, key) =>{
            if(item.category == 'cardio' && userId == item.user_id){
              return (
                <View key={key} style={[styles.cardioBodyItem, styles.cardioBodyItemBorder]}>
                  <Text style={styles.cardioBodyItemText}>{item.category}</Text>
                  <Text style={styles.cardioBodyItemText}>{item.description}</Text>
                  <Text style={styles.cardioBodyItemText}>{item.duration} mins</Text>  
                  <Text style={styles.cardioBodyItemText}>{getDate(item.created_at)}</Text> 
                </View>
                ) 
            }

            if(item.category == 'strength' && userId == item.user_id){
              return (
                <View key={key}>
                  <View style={[styles.bodyItem, styles.strengthBodyItemTopBorder]}>
                    <Text style={styles.strengthBodyItemText}>{item.category}</Text>
                    <Text style={styles.strengthBodyItemText}>{item.description}</Text>
                    <Text style={styles.strengthBodyItemText}>{getDate(item.created_at)}</Text> 
                  </View>
                  <View style={[styles.bodyItem, styles.strengthBodyItemBottomBorder]}>
                    <Text style={styles.strengthBodyItemText}>{item.weight} lbs</Text>
                    <Text style={styles.strengthBodyItemText}>Sets: {item.sets}</Text>
                    <Text style={styles.strengthBodyItemText}>Reps: {item.reps}</Text>
                  </View>
                </View>
                ) 
            }
            
          }) : null}
          </ScrollView>
        </View>
        </>
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
    addWorkoutButton:{
      flex: 2,
      height: 100,
      backgroundColor:'#00bfff',
      justifyContent: 'center',
    },
    addWorkoutButtonText:{
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
    activityIndicator: {
      marginBottom: 600,
      justifyContent: 'flex-start'
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
      fontSize: 15
    },
    body: {
      flex: 4,
      padding: 10,
    },
    bodyItem: {
      flexDirection: 'row',
      marginBottom: 10,
      paddingTop: 10,
      paddingBottom: 10,
    },
    cardioBodyItem: {
      flexDirection: 'row',
      marginBottom: 10,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 15
    },
    cardioBodyItemBorder: {
      borderStyle: 'solid',
      borderWidth: 5,
      borderColor: '#00bfff',
      borderRadius: 10
    },
    cardioBodyItemText: {
      flex: 2,
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center'
    },
    strengthBodyItemTopBorder: {
      borderBottomWidth: 0,
      borderWidth: 5,
      borderColor: '#00bfff',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      marginBottom: 0
    },
    strengthBodyItemBottomBorder: {
      borderTopWidth: 0,
      borderWidth: 5,
      borderColor: '#00bfff',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    strengthBodyItemText: {
      flex: 2,
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center'
    }
})