import { React, useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from "expo-router";
import LottieView from 'lottie-react-native';

const SearchRecipe = () => {
  // Use useLocalSearchParams to get both query and recipes
  const { query, recipes, ingredients} = useLocalSearchParams();
  let initialRecipes = JSON.parse(recipes);
  const [parsedRecipes, setParsedRecipes] = useState(initialRecipes);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5001/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ingredients }),
      });
      const data = await response.json();

      if (response.ok) {
        setParsedRecipes((prevRecipes) => [...prevRecipes, ...data.recipes]);
        setIsLoading(false);
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleRecipePress = (recipe) => {
    router.push({
      pathname: 'showRecipe',
      params: {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        details: JSON.stringify(recipe.details),
        path: 'searchRecipe',
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
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

      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#F36C21" />
          <Text style={styles.backText}>Back to {query} Page</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Grid */}
      <FlatList
        data={parsedRecipes}
        renderItem={({ item: recipe }) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeContainer}
            onPress={() =>
              router.push({
                pathname: 'showRecipe',
                params: {
                  id: recipe.id,
                  name: recipe.name,
                  image: recipe.image,
                  details: JSON.stringify(recipe.details),
                  path: 'searchRecipe',
                },
              })
            }
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            </View>
            <Text style={styles.recipeText}>{recipe.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(recipe) => recipe.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.recipeList}
        onEndReached={loadMoreRecipes} // Load more on scroll
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};
  
  export default SearchRecipe;
  
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#FEF9ED',
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backText: {
      fontSize: 22,
      color: '#F36C21',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    recipeList: {
      paddingTop: 90, 
      paddingHorizontal: 20,
    },
    recipeContainer: {
      flex: 1,
      marginHorizontal: 5, // Adds space between the columns
      marginBottom: 15, // Adds space between rows
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#fff',
      elevation: 3, 
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      height: 250, // Define height explicitly
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%', 
    },
    recipeImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover', 
    },
    recipeText: {
      position: 'absolute',
      bottom: 5,
      left: 5,
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 5,
    },
    columnWrapper: {
      justifyContent: 'space-between', // Ensures even space between columns
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dim background
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10, // Ensures the overlay is above other content
    },
  });