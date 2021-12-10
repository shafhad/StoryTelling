import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from "firebase";

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class StoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            light_theme: true
        };
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
    }

    fetchUser = () => {
        let theme;
        firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", (snapshot) => {
                theme = snapshot.val().current_theme
                this.setState({ light_theme: theme === "light" })
            })
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            return (
                <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate("StoryScreen", story = this.props.story)}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={this.state.light_theme ? styles.cardContainerLight : styles.cardContainer}>
                        <View style={styles.storyImage}>
                            <Image source={require("../assets/story_image_1.png")} style={{ resizeMode: 'contain', width: Dimensions.get('window').width - 60, height: 250, borderRadius: 10 }}></Image>
                        </View>
                        <View style={styles.titleContainer}>
                            <View style={styles.titleTextContainer}>
                                <View style={styles.storyTitle}>
                                    <Text style={this.state.light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>{this.props.story.title}</Text>
                                </View>
                                <View style={styles.storyAuthor}>
                                    <Text style={this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>{this.props.story.author}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={this.state.light_theme ? styles.descriptionTextLight : styles.descriptionText}>
                                {this.props.story.description}
                            </Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <View style={styles.likeButton}>
                                <View style={styles.likeIcon}>
                                    <Ionicons name={"heart"} size={30} color={this.state.light_theme ? "black" : "white"} style={{ width: 30, marginLeft: 20, marginTop: 5 }} />
                                </View>
                                <View>
                                    <Text style={this.state.light_theme ? styles.likeTextLight : styles.likeText}>12k</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    cardContainer: {
        marginTop: -20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "#2f345d",
        borderRadius: 20,
        height: undefined,
        padding: 10
    },
    cardContainerLight: {
        marginTop: -20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "white",
        borderRadius: 20,
        height: undefined,
        padding: 10,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    titleContainer: {
        flexDirection: "row"
    },
    titleTextContainer: {
        flex: 0.8
    },
    iconContainer: {
        flex: 0.2
    },
    storyTitleText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 25,
        color: "white"
    },
    storyTitleTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 25,
        color: "black"
    },
    storyAuthorText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 18,
        color: "white"
    },
    storyAuthorTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 18,
        color: "black"
    },
    descriptionContainer: {
        marginTop: 5
    },
    descriptionText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 13,
        color: "white"
    },
    descriptionTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 13,
        color: "black"
    },
    actionContainer: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    likeButton: {
        backgroundColor: "#eb3948",
        borderRadius: 30,
        width: 160,
        height: 40,
        flexDirection: "row"
    },
    likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: 25,
        marginLeft: 25,
        marginTop: 6
    },
    likeTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 25,
        marginLeft: 25,
        marginTop: 6
    }
});