import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { router } from "expo-router";
import { React, useState} from 'react'

import CustomButton from '../../components/CustomButton';


const Recipes = () => {
  const [search, setSearch] = useState('');

  const recipes = [
    {
      id: 1,
      name: 'Maple Syrup Pancake',
      image: require('../../assets/images/recipes/recipe1.jpg'),
      details: {
        ingredients: [
          { name: 'Flour', quantity: '2 cups' },
          { name: 'Milk', quantity: '1 1/2 cups' },
          { name: 'Eggs', quantity: '2 large' },
          { name: 'Maple Syrup', quantity: '1/4 cup' },
          { name: 'Baking Powder', quantity: '2 tsp' },
          { name: 'Salt', quantity: '1/4 tsp' }
        ],
        directions: [
          'In a large bowl, whisk together flour, baking powder, and salt.',
          'In another bowl, whisk together milk, eggs, and maple syrup.',
          'Combine wet and dry ingredients, stirring just until blended.',
          'Heat a lightly oiled griddle over medium-high heat.',
          'Pour or scoop batter onto the griddle, using about 1/4 cup for each pancake.',
          'Cook until bubbles form on the surface, then flip and cook until golden brown.',
        ],
        readyIn: '25',
        serves: '4'
      }
    },
    {
      id: 2,
      name: 'Creamy Pumpkin Soup',
      image: require('../../assets/images/recipes/recipe5.jpg'),
      details: {
        ingredients: [
          { name: 'Pumpkin', quantity: '4 cups (diced)' },
          { name: 'Onion', quantity: '1 large (chopped)' },
          { name: 'Garlic', quantity: '3 cloves (minced)' },
          { name: 'Vegetable Broth', quantity: '4 cups' },
          { name: 'Coconut Milk', quantity: '1 can (400ml)' },
          { name: 'Olive Oil', quantity: '2 tbsp' },
          { name: 'Salt', quantity: 'to taste' },
          { name: 'Pepper', quantity: 'to taste' }
        ],
        directions: [
          'Heat olive oil in a large pot over medium heat.',
          'Add onion and garlic, and sauté until soft and fragrant.',
          'Add diced pumpkin and cook for 5 minutes, stirring occasionally.',
          'Pour in vegetable broth, bring to a boil, then reduce heat and simmer for 20 minutes.',
          'Blend the soup until smooth using an immersion blender.',
          'Stir in coconut milk, season with salt and pepper, and heat through before serving.'
        ],
        readyIn: '40',
        serves: '6'
      }
    },
    {
      id: 3,
      name: 'Barbecued Salmon',
      image: require('../../assets/images/recipes/recipe3.jpg'),
      details: {
        ingredients: [
          { name: 'Salmon Fillets', quantity: '4 (6 oz each)' },
          { name: 'Soy Sauce', quantity: '1/4 cup' },
          { name: 'Honey', quantity: '2 tbsp' },
          { name: 'Garlic', quantity: '2 cloves (minced)' },
          { name: 'Lemon Juice', quantity: '2 tbsp' },
          { name: 'Olive Oil', quantity: '2 tbsp' }
        ],
        directions: [
          'In a small bowl, whisk together soy sauce, honey, garlic, lemon juice, and olive oil.',
          'Place the salmon fillets in a shallow dish and pour the marinade over them.',
          'Let marinate for 30 minutes.',
          'Preheat the grill to medium heat and lightly oil the grate.',
          'Place salmon on the grill, skin-side down, and cook for 4-5 minutes per side or until the salmon flakes easily with a fork.',
          'Brush with additional marinade while grilling.'
        ],
        readyIn: '60',
        serves: '4'
      }
    },
    {
      id: 4,
      name: 'Creamy Tomato Rigatoni',
      image: require('../../assets/images/recipes/recipe4.jpg'),
      details: {
        ingredients: [
          { name: 'Rigatoni', quantity: '12 oz' },
          { name: 'Tomatoes', quantity: '4 cups (chopped)' },
          { name: 'Heavy Cream', quantity: '1/2 cup' },
          { name: 'Garlic', quantity: '2 cloves (minced)' },
          { name: 'Olive Oil', quantity: '2 tbsp' },
          { name: 'Parmesan Cheese', quantity: '1/2 cup (grated)' },
          { name: 'Salt', quantity: 'to taste' },
          { name: 'Pepper', quantity: 'to taste' }
        ],
        directions: [
          'Cook rigatoni in salted boiling water until al dente, then drain.',
          'In a large skillet, heat olive oil over medium heat.',
          'Add garlic and sauté until fragrant.',
          'Add chopped tomatoes and cook for 10 minutes, stirring occasionally.',
          'Stir in heavy cream and cook for another 5 minutes.',
          'Toss the rigatoni with the tomato-cream sauce and top with grated Parmesan.',
          'Season with salt and pepper to taste.'
        ],
        readyIn: '30',
        serves: '4'
      }
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* User welcome text and image */}
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>What is in your kitchen?</Text>
      </View>

      <SearchBar
        placeholder="Type your ingredients"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        inputStyle={styles.searchText}
      />

      <CustomButton 
        title="Use my ingredients"
        handlePress={() => router.push('../(other)/searchRecipe')}
        containerStyles={styles.customContainer}
      />

      <Text style={styles.subtitle}>Suggested Recipes</Text>

      <FlatList
        data={recipes}
        renderItem={({ item: recipe }) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeContainer}
            onPress={() => router.push({
              pathname: '../(other)/showRecipe',
              params: {
                name: recipe.name,
                image: Image.resolveAssetSource(recipe.image).uri,
                details: JSON.stringify(recipe.details),
                path: 'home'
              },
            })}
          >
            <View style={styles.imageContainer}>
              <Image source={recipe.image} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={recipe => recipe.id.toString()}
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
  searchContainer: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  searchText: {
    fontSize: 14, 
  },
});



