import { StatusBar, Text, View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { React, useState, useContext, Component } from 'react';
import { Link, router } from "expo-router";
import { GlobalContext } from "../GlobalContext";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import LottieView from 'lottie-react-native';

const LogIn = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
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
          number: 8,
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
  
  // this function waits 2 seconds and then resolve a promise without performing any other action
  // it is used to test the loading animation
  function doNothingForTwoSeconds() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); 
    });
  }

  const [isLoading, setIsLoading] = useState(false);

  const processFridgeData = (fridgeData) => {
    return fridgeData.map(fridge => {
      const processedItems = fridge.fridgeItems.map(item => {
        const expirationDate = new Date(item.expiration_date);
        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.quantifier,
          bestBefore: new Date(
            expirationDate.getFullYear(),
            expirationDate.getMonth(),
            expirationDate.getDate()+1
          ),
        };
      });
  
      return {
        fridgeId: fridge.fridgeId,
        fridgeName: fridge.fridgeName,
        fridgeItems: processedItems,
        fridgePasscode: fridge.fridgePasscode
      };
    });
  };

  const handleLogin = async() => {  
    // router.push("../(tabs)/home");
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
        setUserId(data["user_id"]);
        setUsername(data["username"]); 
        setEmail(form.email);
        setPassword(form.password);
        setFavoriteRecipes(data["favoriteRecipes"]);
        setFridgeItems(processFridgeData(data["fridgeData"]));
        setIsLoading(true);  //start showing spinner
        await getRandomRecipes();
        // tidi
        // await doNothingForTwoSeconds(); //used for testing loading animation
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
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LottieView
              source={require('../loading_animation.json')}
              autoPlay
              loop
              style={{ width: 160, height: 160 }}
            />
          </View>
        )}

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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensures the overlay is above other content
  },
});

export default LogIn;