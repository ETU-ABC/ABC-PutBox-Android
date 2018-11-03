import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class App extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://lit-sierra-86142.herokuapp.com/'}}
        style={{marginTop: 20}}
      />
    );
  }
}
