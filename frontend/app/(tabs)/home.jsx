import { React, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import userImage from '../../assets/images/userImage.webp';
import InfoBox from '../../components/InfoBox.jsx';

const Home = () => {
  const userName = 'Nancy';

  // for suggested recipes section
  const recipes = [
    {
      id: 1,
      name: 'Maple Syrup Pancake',
      image: require('../../assets/images/recipe1.jpg'),
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
      image: require('../../assets/images/recipe5.jpg'),
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
      image: require('../../assets/images/recipe3.jpg'),
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
      image: require('../../assets/images/recipe4.jpg'),
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
    },
    {
      id: 5,
      name: 'Blue Cheese Salad',
      image: require('../../assets/images/recipe2.jpg'),
      details: {
        ingredients: [
          { name: 'Mixed Greens', quantity: '4 cups' },
          { name: 'Blue Cheese', quantity: '1/2 cup (crumbled)' },
          { name: 'Walnuts', quantity: '1/4 cup (toasted)' },
          { name: 'Apple', quantity: '1 (sliced)' },
          { name: 'Balsamic Vinegar', quantity: '2 tbsp' },
          { name: 'Olive Oil', quantity: '3 tbsp' },
          { name: 'Salt', quantity: 'to taste' },
          { name: 'Pepper', quantity: 'to taste' }
        ],
        directions: [
          'In a large bowl, toss the mixed greens with sliced apple and toasted walnuts.',
          'In a small bowl, whisk together balsamic vinegar and olive oil.',
          'Drizzle the dressing over the salad and toss to combine.',
          'Top with crumbled blue cheese and season with salt and pepper before serving.'
        ],
        readyIn: '15',
        serves: '4'
      }
    }
  ];
  

  const [currentRecipe, setCurrentRecipe] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const screenWidth = Dimensions.get('window').width;
    const currentIndex = Math.round(scrollPosition / screenWidth);
    setCurrentRecipe(currentIndex);
  };

  const handleDotPress = (index) => {
    setCurrentRecipe(index);
    if (scrollViewRef.current) {
      const screenWidth = Dimensions.get('window').width;
      scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
    }
  };

  // for "expiring inventory section"
  const foodItems = [
    { foodName: 'Milk', image: require('../../assets/images/milk.jpg'), daysLeft: 1 },
    { foodName: 'Eggs', image: require('../../assets/images/eggs.jpg'), daysLeft: 1 },
    { foodName: 'Carrot', image: require('../../assets/images/carrot.jpg'), daysLeft: 3 },
    { foodName: 'Cheese', image: require('../../assets/images/cheese.jpg'), daysLeft: 4 },
    { foodName: 'Chicken', image: require('../../assets/images/chicken.jpg'), daysLeft: 5 },
    { foodName: 'Flour', image: require('../../assets/images/flour.jpg'), daysLeft: 7 }
  ];

  // Function to generate list of InfoBox components
  const renderExpiringItems = (items) => {
    return items.map((item, index) => (
      <InfoBox
        key={index}
        title={item.foodName}
        daysLeft={item.daysLeft.toString()}
        image={item.image}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* User welcome text and image */}
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
        <Image source={userImage} style={styles.userImage} />
      </View>

      {/* Recipe Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carouselContainer}
      >
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeContainer}
            onPress={() => router.push({
              pathname: '../(auth)/showRecipe',
              params: {
                name: recipe.name,
                image: Image.resolveAssetSource(recipe.image).uri,
                details: JSON.stringify(recipe.details),
                path: '../(tabs)/home'
              },
            })}
          >
            {/* Container to overlay text on top of image */}
            <View style={styles.imageContainer}>
              <Image source={recipe.image} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.name}</Text>
            </View>
          </TouchableOpacity>
        ))} 
        </ScrollView> 

      {/* Pagination Dots */}
      <View style={styles.dotContainer}>
        {recipes.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, currentRecipe === index && styles.activeDot]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>

      <View style={styles.expiringContainer}>
        <Text style={styles.subtitle}>Expiring Soon</Text>
        {/* Vertical Scroll for Expiring Items */}
        <ScrollView style={styles.expiringScroll}>
          {renderExpiringItems(foodItems)}
        </ScrollView>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F36C21',
    flexGrow: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  carouselContainer: {
    marginTop: 20, 
    flexGrow: 0, 
    flexShrink: 1, 
  },
  recipeContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '85%',
    height: 180,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  recipeText: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15, 
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: '#A9A9A9',
  },
  expiringContainer: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 30,
  },
  expiringScroll: {
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F36C21',
    marginBottom: 10,
  },
});


export default Home;
