import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class App extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://github.com/ETU-ABC/ABC-PutBox-Android'}}
        style={{marginTop: 20}}
      />
    );
  }
}
