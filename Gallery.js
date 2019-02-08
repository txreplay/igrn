import React from "react";
import {MediaLibrary, Permissions, FileSystem} from "expo";
import {Text, View, Image} from "react-native";

export class Gallery extends React.Component {
    static navigationOptions = {
        title: '📂',
    };

    state = {
        assets: null
    };


    async componentDidMount() {
        const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraPermission: cameraRollStatus === 'granted'
        });

        await this.getPictures();
    }

    async getPictures() {
        const album = await MediaLibrary.getAlbumAsync('igrn');
        const assetsO = await MediaLibrary.getAssetsAsync({album: album});
        const assets = assetsO.assets;

        for (const i in assets) {
            assets[i].src = await this.addSrc(assets[i]);
        }

        await this.setState({assets: assets});
    }

    async addSrc(asset) {
        const data = await FileSystem.readAsStringAsync(asset.uri, {encoding: FileSystem.EncodingTypes.Base64});
        return 'data:image/png;base64,' + data;
    }

    render() {
        let gallery = [];

        for (const i in this.state.assets) {
            gallery.push(
                <Image key={i} source={{uri: this.state.assets[i].src}} style={{width: 240, height: 320}} />
            );
        }
        return (
            <View style={{flex: 1}}>
                {gallery}
            </View>
        );
    }
}
