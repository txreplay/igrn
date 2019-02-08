import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import {AppCamera} from './AppCamera';
import {AppCustom} from './AppCustom';

const AppNavigator = createAppContainer(createStackNavigator({
    AppCamera: {screen: AppCamera},
    AppCustom: {screen: AppCustom},
}, {
    initialRouteName: 'AppCamera'
}));

export default class App extends React.Component {
    render() {
        return <AppNavigator />;
    }
}
