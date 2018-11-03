import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  WebView
} from 'react-native';

var DEFAULT_URL = 'https://lit-sierra-86142.herokuapp.com/';

export default class App extends Component {
  webView = {
    canGoBack: false,
    ref: null,
  }

  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }
  render() {
    return (

      <WebView
        style={{marginTop: 20}}
        ref={(webView) => { this.webView.ref = webView; }}
        onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
        source={{uri: DEFAULT_URL}}
      />

    );
  }

}
