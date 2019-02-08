import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import {CameraApp} from './Camera';

const AppNavigator = createAppContainer(createStackNavigator({
    CameraApp: {screen: CameraApp},
}, {
    initialRouteName: 'CameraApp'
}));

export default class App extends React.Component {
    render() {
        return <AppNavigator />;
    }
}
