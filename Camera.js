import React from "react";
import {Camera, MediaLibrary, Permissions} from "expo";
import {Text, TouchableOpacity, View} from "react-native";

export class CameraApp extends React.Component {
    static navigationOptions = {
        title: '📸',
    };

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        pictureSize: undefined,
        pictureSizes: [],
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

            const pic = await this.camera.takePictureAsync({quality: 0.5});
            const asset = await MediaLibrary.createAssetAsync(pic.uri);

            MediaLibrary.createAlbumAsync('igrn', asset);
        }
    };

    collectPictureSizes = async () => {
        if (this.camera) {
            const pictureSizes = await this.camera.getAvailablePictureSizesAsync('4:3');
            this.setState({ pictureSizes, pictureSize: pictureSizes[0] });
        }
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
                        onCameraReady={this.collectPictureSizes}
                        pictureSize={this.state.pictureSize}
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Gallery')} style={{flex: 0.1}}>
                                <Text style={{fontSize: 50, width: 100}}>📂</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}
