import React from "react";
import {DangerZone, FileSystem, ImageManipulator, MediaLibrary} from "expo";
import {Image, Text, TouchableOpacity, View} from "react-native";
export class AppCustom extends React.Component {
    static navigationOptions = {
        title: '🖼',
    };

    state = {
        rotation: {},
        image: null
    };

    async componentDidMount() {
        this._toggle();

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

    componentWillUnmount() {
        this._unsub();
    }

    _toggle = () => {
        (this._subscription) ? this._unsub() : this._sub();
    };

    _sub = () => {
        DangerZone.DeviceMotion.setUpdateInterval(100);
        this._subscription = DangerZone.DeviceMotion.addListener(async (listener) => {
            await this.setState({rotation: listener.rotation});
        });
    };

    _unsub = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };

    _rotate90andFlip = async () => {
        const manipResult = await ImageManipulator.manipulateAsync(
            this.state.image.uri,
            [{ rotate: this.rotation.alpha*100}, { flip: { vertical: false }}],
            { format: 'png' }
        );
        manipResult.src = await this.getBase64(manipResult.uri);
        this.setState({ image: manipResult });
    };

    getBase64 = async (uri) => {
        const data = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingTypes.Base64});
        return 'data:image/png;base64,' + data;
    };

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {this.state.image && <Image
                    source={{uri: this.state.image.src}}
                    style={{width: 240, height: 320}}
                />}

                <TouchableOpacity
                    onPress={async() => {await this._rotate90andFlip()}} style={{marginTop: 20}}>
                    <Text style={{fontSize: 45}}>⏯</Text>
                </TouchableOpacity>
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
