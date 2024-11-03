import { React, useContext} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from "expo-router";
import { GlobalContext } from "../GlobalContext";


const SearchRecipe = () => {
  // Use useLocalSearchParams to get both query and recipes
  const { query, recipes } = useLocalSearchParams();
  let parsedRecipes = JSON.parse(recipes);

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
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#F36C21" />
          <Text style={styles.backText}>Back to {query} Page</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Grid (2-column layout) */}
      <FlatList
        data={parsedRecipes}
        renderItem={({ item: recipe }) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeContainer}
            onPress={() => handleRecipePress(recipe)}
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
  });