import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, Permissions, MediaLibrary } from 'expo';

export default class Gallery extends React.Component {
    async componentDidMount() {
        const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraPermission: cameraRollStatus === 'granted'
        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>AAA</Text>
            </View>
        );
    }
}
