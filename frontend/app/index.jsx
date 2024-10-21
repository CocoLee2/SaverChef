import { StatusBar, View, StyleSheet, ScrollView, Image, ImageBackground, Button, Text, Platform } from 'react-native';
import CustomButton from '../components/CustomButton'
import { router } from "expo-router"
import logo from "../assets/images/logo.png"
import backgroundImage from "../assets/images/index_bg.png"

// import { useState, useEffect } from 'react';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function App() {
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
              handlePress={() => router.push("/(auth)/splash")}
              containerStyles={styles.customContainer}
            />

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

