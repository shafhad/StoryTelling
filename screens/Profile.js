import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Switch
} from "react-native";

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import firebase from "firebase";

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            isEnabled: false,
            light_theme: true,
            profile_image: "",
            name: ""
        };
    }

    toggleSwitch() {
        const previous_state = this.state.isEnabled;
        const theme = !this.state.isEnabled ? "dark" : "light"
        var updates = {}
        updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"] = theme
        firebase.database().ref().update(updates);
        this.setState({ isEnabled: !previous_state, light_theme: previous_state })
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
    }

    async fetchUser() {
        let theme, name, image;
        await firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", function (snapshot) {
                theme = snapshot.val().current_theme
                name = `${snapshot.val().first_name} ${snapshot.val().last_name}`
                image = snapshot.val().profile_picture
            })
        this.setState({
            light_theme: theme === "light" ? true : false,
            isEnabled: theme === "light" ? false : true,
            name: name,
            profile_image: image
        })
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            return (
                <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image source={require("../assets/logo.png")} style={{ width: 60, height: 60, resizeMode: 'contain', marginLeft: 10 }}></Image>
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>
                                Story Telling App
                            </Text>
                        </View>
                    </View>
                    <View style={styles.screenContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image source={{ uri: this.state.profile_image }} style={styles.profileImage}></Image>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={this.state.light_theme ? styles.nameTextLight : styles.nameText}>{this.state.name}</Text>
                        </View>
                        <View style={styles.themeContainer}>
                            <View style={styles.themeTextContainer}>
                                <Text style={this.state.light_theme ? styles.themeTextLight : styles.themeText}>Dark Theme</Text>
                            </View>
                            <View style={styles.switchContainer}>
                                <Switch
                                    style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                                    trackColor={{ false: "#767577", true: this.state.light_theme ? "#eee" : "white" }}
                                    thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => this.toggleSwitch()}
                                    value={this.state.isEnabled}
                                />
                            </View>
                        </View>
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
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 5,
    },
    appIcon: {
        flex: 0.3
    },
    appTitleTextContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: 28,
        fontFamily: "Bubblegum-Sans",
        paddingLeft: 20
    },
    appTitleTextLight: {
        color: "black",
        fontSize: 28,
        fontFamily: "Bubblegum-Sans",
        paddingLeft: 20
    },
    screenContainer: {
        flex: 0.85
    },
    profileImageContainer: {
        flex: 0.3,
        marginTop: 50,
        alignItems: "center"
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,

    },
    nameContainer: {
        flex: 0.1,
        alignItems: "center"
    },
    nameText: {
        color: "white",
        fontSize: 40,
        fontFamily: "Bubblegum-Sans",
    },
    nameTextLight: {
        color: "black",
        fontSize: 40,
        fontFamily: "Bubblegum-Sans",
    },
    themeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 80
    },
    themeTextContainer: {
        alignItems: "center",
        flex: 0.5
    },
    themeText: {
        color: "white",
        fontSize: 30,
        fontFamily: "Bubblegum-Sans",
    },
    themeTextLight: {
        color: "black",
        fontSize: 30,
        fontFamily: "Bubblegum-Sans",
    },
    switchContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
});