import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, Permissions, MediaLibrary } from 'expo';

import Gallery from './Gallery';

export default class App extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };

    async componentDidMount() {
        const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraPermission: cameraStatus === 'granted' && cameraRollStatus === 'granted'
        });
    }

    takePicture = async () => {
        if (this.camera) {
            const pic = await this.camera.takePictureAsync();
            const album = await MediaLibrary.getAlbumAsync('igrn');
            const asset = await MediaLibrary.createAssetAsync(pic.uri);

            if (album === null) {
                MediaLibrary.createAlbumAsync('igrn', asset);
            }
        }
    };

    openGallery = async () => {
        const album = await MediaLibrary.getAlbumAsync('igrn');
        const assets = await MediaLibrary.getAssetsAsync(album);

        console.log(assets);
    };

    render() {
        const {hasCameraPermission} = this.state;

        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <Camera
                        style={{flex: 1}}
                        type={this.state.type}
                        ref={ref => {this.camera = ref;}}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                            }}>
                            <TouchableOpacity style={{flex: 0.1}}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text style={{fontSize: 50, width: 100}}>🔄</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.takePicture} style={{flex: 0.1}}>
                                <Text style={{fontSize: 50, width: 100}}>📸</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.openGallery} style={{flex: 0.1}}>
                                <Text style={{fontSize: 50, width: 100}}>📂</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}
