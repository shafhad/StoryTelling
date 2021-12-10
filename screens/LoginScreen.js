import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Dimensions
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Google from 'expo-google-app-auth';
import firebase from "firebase";

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false
        };
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );

                // Sign in with credential from the Google user.
                firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then(function (result) {
                        if (result.additionalUserInfo.isNewUser) {
                            firebase
                                .database()
                                .ref("/users/" + result.user.uid)
                                .set({
                                    gmail: result.user.email,
                                    profile_picture: result.additionalUserInfo.profile.picture,
                                    locale: result.additionalUserInfo.profile.locale,
                                    first_name: result.additionalUserInfo.profile.given_name,
                                    last_name: result.additionalUserInfo.profile.family_name,
                                    current_theme: "dark"
                                })
                                .then(function (snapshot) {

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
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    }

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                behaviour: "web",
                androidClientId: "72696421845-lqe44rrjuiggsegp1uv4gklv34tvl3gc.apps.googleusercontent.com",
                iosClientId: "72696421845-osrvc36bjie4264j4c0812sp5a2egqhj.apps.googleusercontent.com",
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onSignIn(result)
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            console.log(e)
            return { error: true };
        }
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image source={require("../assets/logo.png")} style={{ width: 150, height: 150, resizeMode: 'contain', marginLeft: 10 }}></Image>
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={styles.appTitleText}>Story Telling</Text>
                            <Text style={styles.appTitleText}>App</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => this.signInWithGoogleAsync()}>
                            <View style={styles.buttonBox}>
                                <View style={styles.googleIcon}>
                                    <Image source={require("../assets/google_icon.png")} style={{ width: 40, height: 40, resizeMode: 'contain', marginLeft: 10 }}></Image>
                                </View>
                                <View style={styles.googleTextContainer}>
                                    <Text style={styles.googleText}>
                                        Sign in with Google
                                </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cloudContainer}>
                        <Image source={require("../assets/cloud.png")} style={{ width: "100%", resizeMode: 'contain', position: "absolute", bottom: -5 }}></Image>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#15193c"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    appTitle: {
        flex: 0.4,
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    appTitleTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.2,
        marginTop: 80
    },
    appTitleText: {
        color: "white",
        fontSize: 40,
        fontFamily: "Bubblegum-Sans",
    },
    buttonContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonBox: {
        width: Dimensions.get('window').width - 100,
        borderRadius: 50,
        backgroundColor: "white",
        flexDirection: "row",
        flex: 0.6
    },
    googleIcon: {
        flex: 0.3,
        justifyContent: "center",
        textAlign: "center",
        marginLeft: 10
    },
    googleTextContainer: {
        flex: 0.7,
        justifyContent: 'center',
        textAlign: "center"
    },
    googleText: {
        color: "black",
        fontSize: 20,
        fontFamily: "Bubblegum-Sans",
    },
    cloudContainer: {
        flex: 0.3
    }
});