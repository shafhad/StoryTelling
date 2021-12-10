import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from "firebase";

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class CreateStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            previewImage: "image_1",
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
            let preview_images = {
                "image_1": require("../assets/story_image_1.png"),
                "image_2": require("../assets/story_image_2.png"),
                "image_3": require("../assets/story_image_3.png"),
                "image_4": require("../assets/story_image_4.png"),
                "image_5": require("../assets/story_image_5.png")
            }
            return (
                <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image source={require("../assets/logo.png")} style={{ width: 60, height: 60, resizeMode: 'contain', marginLeft: 10 }}></Image>
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>
                                New Story
                            </Text>
                        </View>
                    </View>
                    <ScrollView style={styles.fieldsContainer}>
                        <View style={styles.imageContainer}>
                            <View style={styles.previewContainer}>
                                <Image source={preview_images[this.state.previewImage]} style={{ resizeMode: "contain", width: Dimensions.get('window').width - 40, height: 250, borderRadius: 10, marginBottom: 10 }}></Image>
                            </View>
                            <View style={styles.chooseImage}>
                                <DropDownPicker
                                    items={[
                                        { label: 'Image 1', value: 'image_1' },
                                        { label: 'Image 2', value: 'image_2' },
                                        { label: 'Image 3', value: 'image_3' },
                                        { label: 'Image 4', value: 'image_4' },
                                        { label: 'Image 5', value: 'image_5' }
                                    ]}
                                    defaultValue={this.state.previewImage}
                                    containerStyle={{ height: 40, borderRadius: 20, marginBottom: 10 }}
                                    style={{ backgroundColor: 'transparent' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: this.state.light_theme ? "#eee" : '#2f345d' }}
                                    labelStyle={this.state.light_theme ? styles.dropdownLabelLight : styles.dropdownLabel}
                                    arrowStyle={this.state.light_theme ? styles.dropdownLabelLight : styles.dropdownLabel}
                                    onChangeItem={item => this.setState({
                                        previewImage: item.value
                                    })}
                                />
                            </View>

                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={this.state.light_theme ? styles.inputFontLight : styles.inputFont}
                                onChangeText={(title) => this.setState({ title })}
                                placeholder={"Title"}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont, styles.inputFontExtra, styles.inputTextBig]}
                                onChangeText={(description) => this.setState({ description })}
                                placeholder={"Description"}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont, styles.inputFontExtra, styles.inputTextBig]}
                                onChangeText={(story) => this.setState({ story })}
                                placeholder={"Story"}
                                multiline={true}
                                numberOfLines={20}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont, styles.inputFontExtra, styles.inputTextBig]}
                                onChangeText={(moral) => this.setState({ moral })}
                                placeholder={"Moral of the story"}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                            />
                        </View>
                    </ScrollView>
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
    fieldsContainer: {
        flex: 0.85,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        marginBottom: 100
    },
    inputFont: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        color: "white",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontLight: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        color: "black",
        fontFamily: "Bubblegum-Sans"
    },
    dropdownLabel: {
        color: "white",
        fontFamily: "Bubblegum-Sans"
    },
    dropdownLabelLight: {
        color: "black",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontExtra: {
        marginTop: 10,
    },
    inputTextBig: {
        textAlignVertical: "top",
        height: undefined,
        padding: 5
    },
    submitButton: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});