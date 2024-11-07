import { StatusBar, Text, View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { React, useState, useContext, Component } from 'react';
import { Link, router } from "expo-router";
import { GlobalContext } from "../GlobalContext";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import Spinner from 'react-native-loading-spinner-overlay';

const LogIn = () => {
  const { username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const getRandomRecipes = async() => {
    try {
      const response = await fetch('http://127.0.0.1:5001/get_random', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: 12,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.recipes)
        setRandomRecipes(data.recipes.slice(0, 6)); 
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  }
  
  // this function waits 4 seconds and then resolve a promise without performing any other action
  // it is used to test the loading animation
  function doNothingForFourSeconds() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 4000); 
    });
  }

  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async() => {  
    // Basic validation to check if all fields are filled
    if (!form.email|| !form.password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    // connect to backend
    try {
      const response = await fetch('http://127.0.0.1:5001/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Success: Navigate to the home page or show a success message
        setUsername(data["username"]); 
        setEmail(form.email);
        setPassword(form.password);
        setFavoriteRecipes(data["favoriteRecipes"])
        setIsLoading(true);  //start showing spinner
        await getRandomRecipes();
        setIsLoading(false);  //end showing spinner
        router.push("../(tabs)/home");
      } else {
        // Handle error
        Alert.alert('Error', data.message || 'Log-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"  
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
          animation="fade"
          color="#FFF"
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
  
        <View style={styles.formWrapper}>
          <Text style={styles.Text1}>Welcome back!</Text>
          <Text style={styles.Text2}>Enter your credentials to log in</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginBottom: 20, marginTop: 10 }}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={{ marginBottom: 20, marginTop: 10 }}
          />

          <CustomButton 
            title="Log in"
            handlePress={handleLogin}
            containerStyles={styles.customContainer}
          />

          <Text style={styles.Text2}>Don't have an account?</Text>

          <View style={styles.signUpLinkContainer}>
            <Link
              href="/signUp"
              style={styles.signUpLink}
            >
              SIGN UP
            </Link>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Vertically center content
    alignItems: 'center', // Horizontally center content
    paddingHorizontal: 16, // Add some padding
  },
  formWrapper: {
    width: '100%',
    alignItems: 'center', // Center the form elements horizontally
    minHeight: '85%', // Use percentage for min height
    paddingVertical: 20,
  },
  Text1: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#F36C21',
    marginTop: 20,
    textAlign: 'center',
  },
  Text2: {
    fontSize: 12,
    color: 'rgba(16, 16, 16, 0.34)',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  customContainer: {
    width: '85%',
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center', // Ensure the button is centered
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F36C21',
  },
  spinnerTextStyle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogIn;