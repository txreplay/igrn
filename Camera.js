import React from "react";
import {Camera, FileSystem, MediaLibrary, Permissions} from "expo";
import {Image, Text, TouchableOpacity, View, ScrollView} from "react-native";

export class CameraApp extends React.Component {
    static navigationOptions = {
        title: '📸',
    };

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        ratio: '4:3',
        pictureSize: undefined,
        pictureSizes: [],
        assets: null
    };

    async componentDidMount() {
        const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraPermission: cameraStatus === 'granted' && cameraRollStatus === 'granted'
        });

        await this.getPictures();
    }

    takePicture = async () => {
        if (this.camera) {
            const pic = await this.camera.takePictureAsync({quality: 0.5});
            const asset = await MediaLibrary.createAssetAsync(pic.uri);
            await MediaLibrary.createAlbumAsync('igrn', asset);

            await this.getPictures();
        }
    };

    collectPictureSizes = async () => {
        if (this.camera) {
            const pictureSizes = await this.camera.getAvailablePictureSizesAsync(this.state.ratio);
            this.setState({ pictureSizes, pictureSize: pictureSizes[0] });
        }
    };

    async getPictures() {
        const album = await MediaLibrary.getAlbumAsync('igrn');
        const assetsO = await MediaLibrary.getAssetsAsync({album: album});
        const assets = assetsO.assets.reverse();

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
        const {hasCameraPermission} = this.state;

        let gallery = [];

        for (const i in this.state.assets) {
            gallery.push(
                <Image key={i} source={{uri: this.state.assets[i].src}} style={{width: 120, height: 160}} />
            );
        }

        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <Camera
                        style={{flex: 3}}
                        type={this.state.type}
                        ref={ref => {this.camera = ref;}}
                        onCameraReady={this.collectPictureSizes}
                        pictureSize={this.state.pictureSize}
                        ratio={this.state.ratio}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                alignItems: 'flex-end',
                                marginBottom: 20
                            }}>
                            <TouchableOpacity style={{width: 60, height: 60}}
                            onPress={() => {
                                this.setState({
                                    type: this.state.type === Camera.Constants.Type.back
                                      ? Camera.Constants.Type.front
                                      : Camera.Constants.Type.back,
                                });
                            }}>
                                <Text style={{fontSize: 45}}>🔄</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.takePicture} style={{width: 60, height: 60}}>
                                <Text style={{fontSize: 45}}>📸</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                    <ScrollView horizontal={true} style={{flex: 1}}>
                        {gallery}
                    </ScrollView>
                </View>
            );
        }
    }
}
