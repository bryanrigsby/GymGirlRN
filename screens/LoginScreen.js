import React from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';

//google app auth and firebase imports
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

//client ids
const IOS_CLIENT_ID="709728114457-ti1di36e50eolqi06a00cptgqbpqprtr.apps.googleusercontent.com";
const ANDROID_CLIENT_ID="709728114457-shrn9sae9hthjh0k1ehbf8i9l73hgj9o.apps.googleusercontent.com";

export default function LoginScreen ({navigation}) {

    //google app auth methods
    const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    const onSignIn = (googleUser) => {
        //console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                // googleUser.getAuthResponse().id_token,
                googleUser.idToken,
                googleUser.accessToken
            );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
                .then(function(result){
                    //console.log('user signed in: ' + JSON.stringify(result));
                    if(result.additionalUserInfo.isNewUser){
                        firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .set({
                            id: result.user.providerData[0].uid,
                            gmail: result.user.email,
                            profile_picture: result.additionalUserInfo.profile.picture,
                            locale: result.additionalUserInfo.profile.locale,
                            first_name: result.additionalUserInfo.profile.given_name,
                            last_name: result.additionalUserInfo.profile.family_name,
                            created_at: Date.now()
                        })
                        .then(function(snapshot) {
                            //console.log('Snapshot', snapshot);
                        })
                    }
                    else{
                        firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .update({
                        last_logged_in: Date.now()
                        })  
                    }
                })
                .catch((error) => {
                    
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });
            } 
            else {
                console.log('User already signed-in Firebase.');
            }
        })
    }

    const signInWithGoogle = async ({navigation}) => {
        try {
        const result = await Google.logInAsync({
            iosClientId: IOS_CLIENT_ID,
            androidClientId: ANDROID_CLIENT_ID,
            scopes: ['profile', 'email'],
        });
        if (result.type === 'success') {
            onSignIn(result);
            //console.log("LoginScreen.js.js 21 | ", result);
            navigation.navigate("Home", {
                userId: result.user.id,
                username: result.user.givenName,
                picture: result.user.photoUrl,
            }); //after Google login redirect to HomeScreen
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
        } 
        catch (e) {
            //console.log('LoginScreen.js.js 30 | Error with login', e);
            return { error: true };
        }
    }


    return (
        <ImageBackground source={require('../assets/bruno-nascimento-PHIgYUGQPvU-unsplash.jpg')} imageStyle={{opacity: 0.5}} style={styles.image}>
            {/* <span>Photo by <a href="https://unsplash.com/@bruno_nascimento?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Bruno Nascimento</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span> */}
            <SafeAreaView>
                    <TouchableOpacity
                        style={styles.signinButton}
                        onPress={() => signInWithGoogle({navigation})}
                        underlayColor='#fff'>
                            <Text style={styles.signinButtonText}>Login With Google</Text>
                    </TouchableOpacity> 
            </SafeAreaView>
        </ImageBackground>
    )
}
  


  const styles = StyleSheet.create({
    image: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //opacity: 0.5
      },
    signinButton:{
        height: 125,
        marginTop: 50
      },
    signinButtonText:{
    color: '#ffaed7',
    fontWeight: 'bold',
    fontSize: 34,
    },
      
      
})