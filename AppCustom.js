import React from "react";
import {DangerZone, FileSystem, ImageManipulator, MediaLibrary} from "expo";
import {Image, Text, TouchableOpacity, View} from "react-native";
export class AppCustom extends React.Component {
    static navigationOptions = {
        title: '🖼',
    };

    state = {
        image: null
    };

    async componentDidMount() {
        const { navigation } = this.props;
        const albumId = navigation.getParam('albumId');
        const picId = navigation.getParam('id');

        await this.getImage(albumId, picId);
    }

    getImage = async (albumId, picId) => {
        const assetsO = await MediaLibrary.getAssetsAsync({album: albumId});
        const assets = assetsO.assets;

        for (const i in assets) {
            if (assets[i].id === picId) {
                assets[i].src = await this.getBase64(assets[i].uri);
                this.setState({image: assets[i]});
                break;
            }
        }
    };

    getBase64 = async (uri) => {
        const data = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingTypes.Base64});
        return 'data:image/png;base64,' + data;
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                {this.state.image && <Image
                    source={{uri: this.state.image.src}}
                    style={{width: 240, height: 320}}
                />}
            </View>
        );
    }
}

function round(n) {
    if (!n) {
        return 0;
    }

    return Math.floor(n * 100) / 100;
}
