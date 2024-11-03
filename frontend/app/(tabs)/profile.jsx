import { StatusBar, Text, View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { React, useContext } from 'react';
import { router } from "expo-router";
import { GlobalContext } from "../GlobalContext";
import userImage from '../../assets/images/userImage.webp';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';


const Profile = () => {
  const recipes = [
    {
      id: 1,
      name: 'Grilled Shrimp Tacos',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe6.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Shrimp', quantity: '12 pieces' },
          { name: 'Taco Shells', quantity: '6' },
          { name: 'Lime', quantity: '1' },
          { name: 'Cilantro', quantity: '1/4 cup' },
          { name: 'Avocado', quantity: '1 sliced' },
        ],
        directions: [
          'Grill the shrimp until pink and cooked through.',
          'Assemble the tacos with shrimp, avocado, cilantro, and lime.',
          'Serve with your favorite salsa.'
        ],
        readyIn: '20',
        serves: '2'
      }
    },
    {
      id: 2,
      name: 'Green Peas Cream Soup',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe7.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Green Peas', quantity: '2 cups' },
          { name: 'Onion', quantity: '1 small (chopped)' },
          { name: 'Garlic', quantity: '2 cloves (minced)' },
          { name: 'Vegetable Broth', quantity: '4 cups' },
          { name: 'Cream', quantity: '1/2 cup' }
        ],
        directions: [
          'Sauté onions and garlic in olive oil.',
          'Add peas and broth, cook for 10 minutes.',
          'Blend the soup until smooth and stir in the cream.'
        ],
        readyIn: '30',
        serves: '4'
      }
    },
    {
      id: 3,
      name: 'Roasted Chicken with Orange',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe8.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Chicken', quantity: '1 whole' },
          { name: 'Orange', quantity: '1 sliced' },
          { name: 'Garlic', quantity: '4 cloves (crushed)' },
          { name: 'Olive Oil', quantity: '2 tbsp' },
          { name: 'Rosemary', quantity: '2 sprigs' }
        ],
        directions: [
          'Preheat the oven to 375°F (190°C).',
          'Rub the chicken with olive oil, garlic, and rosemary.',
          'Stuff the chicken with orange slices and roast for 1 hour.'
        ],
        readyIn: '90',
        serves: '6'
      }
    },
    {
      id: 4,
      name: 'Fried Eggs Sunny on Baguette',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe9.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Eggs', quantity: '2 large' },
          { name: 'Baguette', quantity: '1/2 loaf' },
          { name: 'Butter', quantity: '1 tbsp' },
          { name: 'Parsley', quantity: '1 tbsp (chopped)' }
        ],
        directions: [
          'Fry the eggs sunny-side up in butter.',
          'Toast the baguette and top with the fried eggs.',
          'Garnish with parsley and serve.'
        ],
        readyIn: '10',
        serves: '1'
      }
    },
    {
      id: 5,
      name: 'Quinoa Salad',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe10.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Quinoa', quantity: '1 cup (cooked)' },
          { name: 'Cucumber', quantity: '1/2 cup (chopped)' },
          { name: 'Tomatoes', quantity: '1/2 cup (chopped)' },
          { name: 'Lemon Juice', quantity: '2 tbsp' },
          { name: 'Olive Oil', quantity: '1 tbsp' }
        ],
        directions: [
          'Combine all the ingredients in a large bowl.',
          'Toss with lemon juice and olive oil.',
          'Serve chilled.'
        ],
        readyIn: '15',
        serves: '2'
      }
    },
    {
      id: 6,
      name: 'Macaroni and Cheese',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe11.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Macaroni', quantity: '2 cups (cooked)' },
          { name: 'Cheddar Cheese', quantity: '1 cup (shredded)' },
          { name: 'Milk', quantity: '1 cup' },
          { name: 'Butter', quantity: '2 tbsp' },
          { name: 'Flour', quantity: '2 tbsp' }
        ],
        directions: [
          'Make a roux with butter and flour, then stir in milk.',
          'Add cheese to the mixture and stir until melted.',
          'Combine with macaroni and bake for 20 minutes.'
        ],
        readyIn: '40',
        serves: '4'
      }
    },
    {
      id: 7,
      name: 'Asian Cuisine',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe12.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Rice Noodles', quantity: '2 cups' },
          { name: 'Soy Sauce', quantity: '3 tbsp' },
          { name: 'Ginger', quantity: '1 tbsp (minced)' },
          { name: 'Garlic', quantity: '2 cloves (minced)' },
          { name: 'Sesame Oil', quantity: '1 tbsp' }
        ],
        directions: [
          'Cook the rice noodles according to package instructions.',
          'Sauté garlic and ginger in sesame oil, then add noodles.',
          'Toss with soy sauce and serve.'
        ],
        readyIn: '25',
        serves: '2'
      }
    },
    {
      id: 8,
      name: 'Triple Layer Chocolate Cake',
      image: Image.resolveAssetSource(require('../../assets/images/recipes/recipe13.jpg')).uri,
      details: {
        ingredients: [
          { name: 'Flour', quantity: '2 cups' },
          { name: 'Cocoa Powder', quantity: '3/4 cup' },
          { name: 'Sugar', quantity: '2 cups' },
          { name: 'Eggs', quantity: '3 large' },
          { name: 'Butter', quantity: '1/2 cup (melted)' }
        ],
        directions: [
          'Preheat oven to 350°F (175°C).',
          'Mix dry ingredients, then stir in eggs and melted butter.',
          'Bake in three pans for 30 minutes, cool, and assemble layers with frosting.'
        ],
        readyIn: '60',
        serves: '8'
      }
    },
  ];

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
          favoriet_recipes: favoriteRecipes, // Correct typo if needed
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
        <TouchableOpacity onPress={() => router.push({pathname: '../(other)/searchRecipe',params: {query: 'Profile', recipes: JSON.stringify(recipes)}})} style={styles.listItem}>
        {/* <TouchableOpacity onPress={handleGetFavoriteRecipes} style={styles.listItem}> */}
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