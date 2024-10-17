import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import userImage from '../../assets/images/userImage.webp';
import InfoBox from '../../components/InfoBox.jsx';

const Home = () => {
  const userName = 'Nancy';

  // for suggested recipes section
  const recipes = [
    { id: 1, name: 'Maple syrup pancake', image: require('../../assets/images/recipe1.jpg') },
    { id: 2, name: 'Creamy pumpkin soup', image: require('../../assets/images/recipe5.jpg') },
    { id: 3, name: 'Barbecued salmon', image: require('../../assets/images/recipe3.jpg') },
    { id: 4, name: 'Creamy tomato rigatoni', image: require('../../assets/images/recipe4.jpg') },
    { id: 5, name: 'Blue cheese salad', image: require('../../assets/images/recipe2.jpg') },
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
          <View key={recipe.id} style={styles.recipeContainer}>
            {/* Container to overlay text on top of image */}
            <View style={styles.imageContainer}>
              <Image source={recipe.image} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.name}</Text>
            </View>
          </View>
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
