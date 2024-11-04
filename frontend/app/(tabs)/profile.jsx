import { StatusBar, Text, View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { React, useContext } from 'react';
import { router } from "expo-router";
import { GlobalContext } from "../GlobalContext";
import userImage from '../../assets/images/userImage.webp';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';


const Profile = () => {
  const { username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes } = useContext(GlobalContext);

  const handleGetFavoriteRecipes = async () => {
    console.log(`Favorite recipes are: ${favoriteRecipes}`);
    try {
      const response = await fetch('http://127.0.0.1:5001/get_favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriet_recipes: favoriteRecipes,
        }),
      });
  
      const data = await response.json();
  
      // Check for response status
      if (response.ok) {
        router.push({
          pathname: '../(other)/searchRecipe',
          params: { query: 'Profile', recipes: JSON.stringify(data.recipes) },
        });
      } else if (response.status === 404) {
        // Handle the case when the resource is not found (404 Not Found)
        Alert.alert('Not Found', 'Favorite recipes not found.');
      } else {
        // Handle other errors
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  };


  const handleLogOut = () => {
    // Show confirmation alert
    Alert.alert(
      "Log out",
      "Are you sure you want to log out your account?",
      [
        {
          text: "Cancel", 
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            router.push("../(auth)/logIn"); 
          },
        },
      ],
      { cancelable: false } 
    );
  }

  const handleDeleteAccount = async() => {
    // Show confirmation alert
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel", 
          style: "cancel",
          onPress: () => console.log("Delete action cancelled"),
        },
        {
          text: "Yes",
          onPress: async() => {
            try {
              const response = await fetch('http://127.0.0.1:5001/delete_account', {  
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: email,
                }),
              });
        
              Alert.alert('Success', 'Account deleted successfully!')
              router.push("../(auth)/logIn")
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Network Error', 'Something went wrong. Please try again later.');
            }
          },
        },
      ],
      { cancelable: false } // Forces user to choose an option
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.imageWrapper}>
        <Image
          source={userImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.username}>{username}</Text>
      <Text style={styles.email}>nancycui@example.com</Text>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* tidi */}
        {/* <TouchableOpacity onPress={() => router.push({pathname: '../(other)/searchRecipe',params: {query: 'Profile', recipes: JSON.stringify(recipes)}})} style={styles.listItem}> */}
        <TouchableOpacity onPress={handleGetFavoriteRecipes} style={styles.listItem}>
          <MaterialIcons name="favorite-border" size={24} color="black" style={styles.icon} />
          <Text style={styles.listItemText}>My Favorite</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {router.push("../(auth)/changePassword")}} style={styles.listItem}>
          <MaterialIcons name="password" size={24} color="black" style={styles.icon}  />
          <Text style={styles.listItemText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogOut} style={styles.listItem}>
          <AntDesign name="logout" size={24} color="black" style={styles.icon} />
          <Text style={styles.listItemText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.listItem}>
        <AntDesign name="deleteuser" size={24} color="black" style={styles.icon} />
          <Text style={[styles.listItemText, styles.deleteText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 50,
    marginTop: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: 'rgba(16, 16, 16, 0.6)',
    marginTop: 5,
    textAlign: 'center',
  },
  actionsContainer: {
    marginTop: 30,
    width: '85%',
  },
  listItem: {
    backgroundColor: '#FFFFFF', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  deleteText: {
    color: '#F36C21', 
  },
  icon: {
    marginRight: 10, 
  },
});