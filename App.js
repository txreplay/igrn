import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import {Gallery} from './Gallery';
import {CameraApp} from './Camera';

const AppNavigator = createAppContainer(createStackNavigator({
    CameraApp: {screen: CameraApp},
    Gallery: {screen: Gallery}
}, {
    initialRouteName: 'CameraApp'
}));

export default class App extends React.Component {
    render() {
        return <AppNavigator />;
    }
}
