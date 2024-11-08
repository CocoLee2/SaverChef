import { React, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GlobalContext } from "../GlobalContext";
import CustomButton from '../../components/CustomButton';

const ShowRecipe = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);

  const { id, name, image, details } = useLocalSearchParams();
  const { ingredients, directions, readyIn, serves } = JSON.parse(details);
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(favoriteRecipes.includes(id));

  // Toggle favorite status
  const toggleFavorite = async () => {
    setIsFavorited(!isFavorited);
    message = 'add'
    if (!isFavorited) {
      console.log(`user marked recipe ${id} as favorite`);
      setFavoriteRecipes([...favoriteRecipes, id]);
    } else {
      console.log(`user unmarked recipe ${id} as favorite`);
      setFavoriteRecipes(favoriteRecipes.filter(recipeId => recipeId !== id));
      message = 'delete'
    }
    try {
      const response = await fetch('http://127.0.0.1:5001/mark_favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          recipe_id: id,
          message: message
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle other errors
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  };

  const handleCookRecipe = () => {
    // todo
    console.log("User wants to cook this recipe, router push update ingredient page");
  };

  return (
    <View style={styles.wrapper}>
      {/* Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* ScrollView for the entire content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Image as the background (placed first but will act as bottom layer) */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.backgroundImage} />
        </View>

        {/* Favorite Heart Button */}
        <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
          <Ionicons 
            name={isFavorited ? "heart" : "heart-outline"} 
            size={32} 
            color={isFavorited ? "#F36C21" : "#ccc"} // Change color based on state
          />
        </TouchableOpacity>

        {/* Content goes on top of the image */}
        <View style={styles.detailsContainer}>
          <Text style={styles.recipeTitle}>{name}</Text>

          <Text style={styles.subheading}>Ready in: {readyIn} minutes</Text>
          <Text style={styles.subheading}>Serves: {serves}</Text>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              {item.quantity} {item.name}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Directions</Text>
          {directions.map((step, index) => (
            <Text key={index} style={styles.listItem}>
              {index + 1}. {step}
            </Text>
          ))}

          <CustomButton 
            title="Cook This Recipe"
            handlePress={handleCookRecipe}
            containerStyles={styles.customContainer}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#FEF9ED',
    },
    header: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 2, // Ensure the back arrow is above everything else
    },
    scrollContainer: {
      flexGrow: 1,
    },
    imageContainer: {
      position: 'relative',
    },
    backgroundImage: {
      width: '100%',
      height: Dimensions.get('window').height * 0.4, // Image covers 40% of the screen height
      resizeMode: 'cover',
    },
    heartButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 2, // Ensure the heart button is on top
    },
    detailsContainer: {
      backgroundColor: '#FFF', // Changed to white for better contrast
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
      shadowColor: '#000', // Adding shadow for depth
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    recipeTitle: {
      fontSize: 32, // Slightly larger for emphasis
      fontWeight: 'bold',
      color: '#F36C21', // Keep this distinctive orange color
      textAlign: 'center',
      marginBottom: 15, // Increased margin for spacing
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600', // Make it stand out more
      color: '#5a5a5a', // Softer grey for readability
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 24, // Slightly larger for section headings
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 15, // Fixing the typo from 'maginBottom' to 'marginBottom'
      color: '#F36C21', // Matching the theme color
    },
    listItem: {
      fontSize: 16,
      marginVertical: 5,
      color: '#333', // Darker color for better readability
      paddingLeft: 10, // Add padding for cleaner list appearance
    },
    customContainer: {
      width: '90%',
      marginTop: 40,
      marginBottom: 20,
      alignSelf: 'center', // Ensure the button is centered
    },
  });


export default ShowRecipe;
