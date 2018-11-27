import React, {Component} from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, WebView, BackHandler } from 'react-native';

import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import Cookie from 'react-native-cookie';
import AndroidWebView from 'react-native-webview-file-upload-android';


var DEFAULT_URL = 'http://putbox-abc.herokuapp.com/';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      url: DEFAULT_URL
    };
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
     BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }


    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          console.log("Opened notification: ",notification);
          this.changeURL(notification.data.url);
          console.log("Changed the url to ",notification.data.url);
        }
      });
    this.cookieCheck();
  }
  cookieCheck(){
    const user = firebase.auth().currentUser;
    Cookie.get('http://putbox-abc.herokuapp.com/','token').then((cookie) =>{
      if(user){
        if(cookie!==null && cookie!==undefined){
          if(user.email!==cookie.concat('@abc.com').toLowerCase()){
            console.log("Logging out(cookie and email are different) from user: ",cookie.concat('@abc.com'), user.email);
            firebase.messaging().unsubscribeFromTopic(user.email.substring(0, user.email.lastIndexOf("@")));
            firebase.auth().signOut().then(()=>{
              firebase.auth()
              .signInWithEmailAndPassword(cookie.concat('@abc.com'),'123456')
              .catch(error => {
                  console.log(error.message, error.code);
                  if(error.code=='auth/user-not-found'){
                    firebase.auth().createUserWithEmailAndPassword(cookie.concat('@abc.com'),'123456')
                    .catch(error =>{
                      console.log(error.message, error.code);
                    });
                  }
              })
              .then(()=>{
                firebase.messaging().subscribeToTopic(cookie).then(()=>{
                  console.log("Logged out(cookie and email are different) and relogged&subbed to: ",cookie);
                  console.log('Logged user info1-> ', user.toJSON());
                }).catch(error =>{
                  console.log(error.message, error.code);
                });
              });
           });
         }
       }
      }
      else{
        if(cookie!==null && cookie!==undefined){
          firebase.auth()
          .signInWithEmailAndPassword(cookie.concat('@abc.com'),'123456')
          .catch(error => {
            console.log(error.message, error.code);
              if(error.code=='auth/user-not-found'){
                firebase.auth().createUserWithEmailAndPassword(cookie.concat('@abc.com'),'123456')
                .catch(error =>{
                  console.log(error.message, error.code);
                });
              }
          });
          firebase.messaging().subscribeToTopic(cookie).then(()=>{
            console.log('No user exists before and logged in to cookie: ', cookie)
            console.log('Logged user info2-> ', user.toJSON());
          }).catch(error =>{
            console.log(error.message, error.code);
          });
        }
      }
    }).catch(error=>{
      console.log(error.message, error.code);
    });
  }
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
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
    this.cookieCheck();
  }
  changeURL(newUrl){
    console.log(newUrl);
    this.setState({ url: newUrl });
  }
  render() {
    const { url } = this.state;
    return (
      <View style={{flex:1}}>
        {Platform.select({
              android:  () =>
                <AndroidWebView

                  ref={(webView) => { this.webView.ref = webView; }}
                  onNavigationStateChange={(navState) => {
                    this.webView.canGoBack = navState.canGoBack;
                  ;}}
                  source={{uri: url}}
                />,
              ios:      () =>
                <WebView
                  ref={(webView) => { this.webView.ref = webView; }}
                  onNavigationStateChange={(navState) => {
                    this.webView.canGoBack = navState.canGoBack;
                  ;}}
                  source={{uri: url}}
                />
        })()}
      </View>


    );
  }
}
