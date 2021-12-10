import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    Dimensions
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Speech from 'expo-speech';


import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from "firebase";

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class StoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            speakerColor: "gray",
            speakerIcon: 'volume-high-outline',
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

    async initiateTTS(title, author, story, moral) {
        console.log(title)
        const current_color = this.state.speakerColor
        this.setState({ speakerColor: current_color === "gray" ? "#ee8249" : "gray" })
        if (current_color === "gray") {
            Speech.speak(`${title} by ${author}`)
            Speech.speak(story)
            Speech.speak("The moral of the story is!")
            Speech.speak(moral)
        } else {
            Speech.stop()
        }
    }

    render() {
        if (!this.props.route.params) {
            this.props.navigation.navigate("Home")
        } else if (!this.state.fontsLoaded) {
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
                    <View style={styles.storyContainer}>
                        <ScrollView style={this.state.light_theme ? styles.storyCardLight : styles.storyCard}>
                            <View style={styles.imageContainer}>
                                <Image source={require("../assets/story_image_1.png")} style={{ resizeMode: 'contain', width: Dimensions.get('window').width - 40, height: 250, borderRadius: 20, marginTop: -10 }}></Image>
                            </View>
                            <View style={styles.dataContainer}>
                                <View style={styles.titleTextContainer}>
                                    <View style={styles.storyTitle}>
                                        <Text style={this.state.light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>{this.props.route.params.title}</Text>
                                    </View>
                                    <View style={styles.storyAuthor}>
                                        <Text style={this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>{this.props.route.params.author}</Text>
                                    </View>
                                    <View style={styles.storyAuthor}>
                                        <Text style={this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>{this.props.route.params.created_on}</Text>
                                    </View>
                                </View>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => this.initiateTTS(this.props.route.params.title, this.props.route.params.author, this.props.route.params.story, this.props.route.params.moral)}>
                                        <Ionicons name={this.state.speakerIcon} size={30} color={this.state.speakerColor} style={{ width: 30, margin: 15 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.storyTextContainer}>
                                <View>
                                    <Text style={this.state.light_theme ? styles.storyTextLight : styles.storyText}>{this.props.route.params.story}</Text>
                                </View>
                                <View>
                                    <Text style={this.state.light_theme ? styles.moralTextLight : styles.moralText}>Moral - {this.props.route.params.moral}</Text>
                                </View>
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
                        </ScrollView>
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
    storyContainer: {
        flex: 1
    },
    storyCard: {
        margin: 20,
        backgroundColor: "#2f345d",
        borderRadius: 20,
    },
    storyCardLight: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    imageContainer: {
        flex: 0.4
    },
    dataContainer: {
        flex: 0.6,
        flexDirection: "row",
        padding: 20
    },
    titleTextContainer: {
        flex: 0.8
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
    iconContainer: {
        flex: 0.2
    },
    storyTextContainer: {
        padding: 20
    },
    storyText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 15,
        color: "white"
    },
    storyTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 15,
        color: "black"
    },
    moralText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 20,
        color: "white"
    },
    moralTextLight: {
        fontFamily: "Bubblegum-Sans",
        fontSize: 20,
        color: "black"
    },
    actionContainer: {
        margin: 10,
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