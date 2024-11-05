import { React, useState, useRef, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import { GlobalContext } from "../GlobalContext";
import userImage from '../../assets/images/userImage.webp';
import InfoBox from '../../components/InfoBox.jsx';
import images from '../../constants/images';

const Home = () => {
  const { username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);

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

  const getImage = (foodName) => {
    const sanitizedFoodName = foodName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const image = images[sanitizedFoodName];
    return image ? image : require('../../assets/images/placeHolder.png');
  };
  
  // for "expiring inventory section" 
  const foodItems = [
    { foodName: 'Pasta', daysLeft: 1 },
    { foodName: 'Milk', daysLeft: 1 },
    { foodName: 'Egg', daysLeft: 1 },
    { foodName: 'Carrot', daysLeft: 3 },
    { foodName: 'Cheese', daysLeft: 4 },
    { foodName: 'Chicken', daysLeft: 5 },
    { foodName: 'Flour', daysLeft: 7 }
  ];

  // Function to generate list of InfoBox components
  const renderExpiringItems = (items) => {
    return items.map((item, index) => (
      <InfoBox
        key={index}
        title={item.foodName}
        daysLeft={item.daysLeft.toString()}
        // image={item.image}
        image={getImage(item.foodName)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* User welcome text and image */}
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <Pressable onPress={() => (router.push('profile'))}>
          <Image source={userImage} style={styles.userImage} />
        </Pressable>
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
        {/* tidi */}
        {randomRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeContainer}
            onPress={() => router.push({
              pathname: '../(other)/showRecipe',
              params: {
                id: recipe.id,
                name: recipe.name,
                image: recipe.image,
                details: JSON.stringify(recipe.details),
                path: '../(tabs)/home'
              },
            })}
          >
            {/* Container to overlay text on top of image */}
            <View style={styles.imageContainer}>
              <Image source={{uri: recipe.image}} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.name}</Text>
            </View>
          </TouchableOpacity>
        ))} 
        </ScrollView> 

      {/* Pagination Dots */}
      <View style={styles.dotContainer}>
        {/* tidi */}
        {randomRecipes.map((_, index) => (
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

