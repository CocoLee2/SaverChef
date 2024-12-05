import { StatusBar, View, StyleSheet, ScrollView, Image, ImageBackground, Platform, Pressable } from 'react-native';
import { router } from "expo-router";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/index_bg.png";
import LottieView from 'lottie-react-native';

// Uncomment these imports when enabling notifications
// import { useState, useEffect } from 'react';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// Uncomment this when enabling notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function App() {
  // const [expoPushToken, setExpoPushToken] = useState('');

  // useEffect(() => {
  //   // Capture push token at app startup
  //   registerForPushNotificationsAsync().then(token => {
  //     setExpoPushToken(token); // Store token locally
  //   }).catch(err => console.log('Error registering for push notifications:', err));
  // }, []);

  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Device.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notifications!');
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  //   return token;
  // }
  
  return (
      <Pressable style={styles.container} onPress={() => router.push("/(other)/splash")}>

      <StatusBar barStyle="dark-content" />

        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
            />

            <LottieView
              source={require('./index_animation.json')}
              autoPlay
              loop
              style={{ width: 250, height: 300, marginTop: -40 }}
            />
          </View>     
        </ScrollView>
        </ImageBackground>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center', 
    marginTop: 160, 
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80, 
  },
});
