import { StatusBar, View, StyleSheet, ScrollView, Image, ImageBackground, Platform, Button } from 'react-native';
import CustomButton from '../components/CustomButton'
import { router } from "expo-router"
import logo from "../assets/images/logo.png"
import backgroundImage from "../assets/images/index_bg.png"

import { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  // todo
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    })
    .catch((err) => console.log(err));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  const sendNotification = async (ingredientName, daysLeft) => {
    console.log("Sending push notification...");
  
    const message = {
      to: expoPushToken,
      sound: "default",
      title: `${ingredientName} expiring in ${daysLeft} days`,
      body: `Your ${ingredientName} will expire soon!`,
    };
  
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };
  

  return (
      <View style={styles.container}>

      <StatusBar
        barStyle="dark-content"  
      />

        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* <Text style={styles.loadingText}>
                Loading...
            </Text> */} 
            {/* todo: set time out and replace button with text "Loading..." */}
     
            <CustomButton 
              title="Loading..."
              handlePress={() => router.push("/(other)/splash")}
              containerStyles={styles.customContainer}
            />

            <Button title="Send push notification" 
            onPress={() => sendNotification("Apple", 3)}/>

          </View>
          
        </ScrollView>
        </ImageBackground>
      </View>
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
    marginTop: 120, 
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90, 
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40, 
    textAlign: 'center', 
  },

  customContainer: {
    width: '60%',
    marginTop: 30, 
  },
});

