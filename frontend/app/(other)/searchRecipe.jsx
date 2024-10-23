import { React } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from "expo-router";


const recipes = [
    {
      id: 1,
      name: 'Grilled Shrimp Tacos',
      image: require('../../assets/images/recipes/recipe6.jpg'),
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
      image: require('../../assets/images/recipes/recipe7.jpg'),
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
      image: require('../../assets/images/recipes/recipe8.jpg'),
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
      image: require('../../assets/images/recipes/recipe9.jpg'),
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
      image: require('../../assets/images/recipes/recipe10.jpg'),
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
      image: require('../../assets/images/recipes/recipe11.jpg'),
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
      image: require('../../assets/images/recipes/recipe12.jpg'),
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
      image: require('../../assets/images/recipes/recipe13.jpg'),
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
  

  const SearchRecipe = () => {
    const { query } = useLocalSearchParams();

    const handleRecipePress = (recipe) => {
      // Navigate to the showRecipe page with the selected recipe details
      router.push({
        pathname: 'showRecipe',
        params: {
          name: recipe.name,
          image: Image.resolveAssetSource(recipe.image).uri,
          details: JSON.stringify(recipe.details),
          path: 'searchRecipe' // Passing the current path
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
          data={recipes}
          renderItem={({ item: recipe }) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeContainer} 
              onPress={() => handleRecipePress(recipe)}
            >
              <View style={styles.imageContainer}>
                <Image source={recipe.image} style={styles.recipeImage} />
              </View>
              <Text style={styles.recipeText}>{recipe.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={recipe => recipe.id.toString()}
          numColumns={2} // Set it to 2-column layout
          columnWrapperStyle={styles.columnWrapper} // Adds space between columns
          contentContainerStyle={styles.recipeList} // Style for the overall list
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