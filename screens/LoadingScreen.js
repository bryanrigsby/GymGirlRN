import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

export default function LoadingScreen ({navigation}) {

    useEffect(() => {
        checkIfLoggedIn();
    }, [])
    
    const checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                navigation.navigate('HomeScreen');
            }
            else{
                navigation.navigate('LoginScreen');
            }
        })
    }

    return(
        <View style={styles.container}>
            <ActivityIndicator animating={true} color="black" size="small" />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})