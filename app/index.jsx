// import { StatusBar } from 'expo-status-bar';
import { StatusBar, Text, View, StyleSheet, ScrollView, Image, ImageBackground } from 'react-native';
// import { Link } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton'
import { Redirect, router } from "expo-router"

import logo from "../assets/images/logo.png"
import backgroundImage from "../assets/images/index_bg.png"

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