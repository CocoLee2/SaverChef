import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet, StatusBar, Alert, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { router } from "expo-router";
import { React, useState, useContext, useEffect} from 'react';
import { GlobalContext } from "../GlobalContext";
import CustomButton from '../../components/CustomButton';
import LottieView from 'lottie-react-native';

const Recipes = () => {
  const [search, setSearch] = useState('');

  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]); // Store loaded recipes

  // This helper function is used by both handleUseMyIngredients and handleNewButtonPress.
  // It takes a list of validated strings as ingredients,
  // sends a request to the backend to fetch recipes, 
  // and navigates to the searchRecipe page with the retrieved recipes data.
  const fetchRecipes = async (ingredients) => {
    setIsLoading(true);  //start showing spinner
    if (ingredients.length === 0) {
      Alert.alert('Input Error', 'Please enter ingredients separated by commas, and try again.'); 
      setIsLoading(false);  
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients, 
        }),
      });
  
      const data = await response.json();
  
      // Check for response status
      if (response.ok) {
        router.push({
          pathname: '../(other)/searchRecipe',
          params: { query: 'Recipe', recipes: JSON.stringify(data.recipes), ingredients: ingredients },
        });
        setIsLoading(false);  //end showing spinner
      } else {
        // Handle other errors
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
        setIsLoading(false);  //end showing spinner
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
      setIsLoading(false);  //end showing spinner
    }
  }

  const handleUseMyIngredients = async () => {
    const ingredients = fridgeItems.flatMap(fridge => 
      fridge.fridgeItems.map(item => item.name)
    );
    
    // console.log("line66 in inventory.jsx")
    // console.log(ingredients)
    fetchRecipes(ingredients)
  }

  const handleNewButtonPress = async () => {
    let ingredients = search.split(",").map(item => item.trim());
    const validIngredientRegex = /^[a-zA-Z\s]+$/;
    // do some simple checks on the input strings
    ingredients = ingredients.filter(item => validIngredientRegex.test(item));
    fetchRecipes(ingredients)
  }


  return (
    <View style={styles.container}>
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
      
      {/* User welcome text and image */}
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>What is in your kitchen?</Text>
      </View>
  
      <View style={styles.searchRowContainer}>
        <SearchBar
          placeholder="Type your ingredients"
          onChangeText={setSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
          inputStyle={styles.searchText}
        />
  
        <CustomButton
          title="Search"
          handlePress={handleNewButtonPress}
          containerStyles={styles.newButtonContainer} 
          textStyles={styles.newButtonText}
        />
      </View>
  
      <CustomButton 
        title="Use my ingredients"
        handlePress={handleUseMyIngredients}
        containerStyles={styles.customContainer}
      />
  
      <Text style={styles.subtitle}>Suggested Recipes</Text>
  
      <FlatList
        data={randomRecipes}
        renderItem={({ item: recipe }) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeContainer}
            onPress={() =>
              router.push({
                pathname: '../(other)/showRecipe',
                params: {
                  id: recipe.id,
                  name: recipe.name,
                  image: recipe.image,
                  details: JSON.stringify(recipe.details),
                  path: 'home',
                },
              })
            }
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(recipe) => recipe.id.toString()}
        numColumns={2} // Makes it a 2-column layout
        columnWrapperStyle={styles.columnWrapper} // Adds some spacing between the columns
      />
    </View>
  );  
}

export default Recipes;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F36C21',
    flexGrow: 1,
    marginRight: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  customContainer: {
    width: '100%',
    marginTop: 15,
    marginBottom: 20,
    alignSelf: 'center', 
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F36C21',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 5
  },
  recipeContainer: {
    flex: 1, 
    marginHorizontal: 5,
    marginBottom: 15,
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
    justifyContent: 'space-between', 
  },
  searchRowContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    marginTop: 10, // Add top margin if needed
  },
  searchContainer: {
    flex: 7, // Use 80% of the space
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    height: 60, // Set a uniform height
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    height: 40, // Set the same height for the input
  },
  searchText: {
    fontSize: 14, 
  },
  newButtonContainer: {
    flex: 2, 
    marginLeft: 5, 
    minHeight: 40, 
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#FFA500',
  }, 
  newButtonText: {
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 14, 
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensures the overlay is above other content
  },
});



