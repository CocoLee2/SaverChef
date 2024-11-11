import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { Redirect, router } from "expo-router"
import React from 'react'
import CustomButton from '../../components/CustomButton'
import LottieView from 'lottie-react-native';

const Splash = () => {
  return (
    <View className="bg-primary h-full">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>

          <LottieView
            source={require('../cooking_animation.json')}
            autoPlay
            loop
            style={{ width: 250, height: 250, marginTop: -30}}
          />

          <Text style={styles.Text1}>
            Smart Meal Planning.{"\n"}Less Food Waste.
          </Text> 

          <Text style={styles.Text2}>
            Easily track your groceries, get reminders {"\n"} 
            before food expires, and discover delicious {"\n"} 
            recipes based on what you have.
          </Text> 
    
          <CustomButton 
            title="Get Started"
            handlePress={() => router.push("/logIn")}
            containerStyles={styles.customContainer}
          />

        </View>  
      </ScrollView>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center', 
    marginTop: 100, 
  },
  Text1: {
    fontSize: 22,
    color: 'rgba(16, 16, 16, 0.8)',
    marginTop: 40,
    textAlign: 'center',
  },
  Text2: {
    fontSize:12,
    color: 'rgba(16, 16, 16, 0.34)',
    marginTop: 10,
    textAlign: 'center',
  },
  customContainer: {
    width: '80%',
    marginTop: 40, 
  },
});