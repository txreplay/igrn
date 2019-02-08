import React from "react";
import {Camera, FileSystem, MediaLibrary, Permissions} from "expo";
import {Image, Text, TouchableOpacity, View, ScrollView} from "react-native";

export class AppCustom extends React.Component {


    render() {
        const { navigation } = this.props;
        const picture = navigation.getParam('picture');

        return (
            <Image
                source={{uri: picture}}
                style={{flex: 1}}
            />
        );
    }

}
