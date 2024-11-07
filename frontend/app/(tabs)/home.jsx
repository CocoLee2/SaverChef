import { React, useState, useRef, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { GlobalContext } from "../GlobalContext";
import userImage from '../../assets/images/userImage.webp';
import InfoBox from '../../components/InfoBox.jsx';
import images from '../../constants/images';

const Home = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);

  const scrollViewRef = useRef(null);

  const getImage = (foodName) => {
    const sanitizedFoodName = foodName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const image = images[sanitizedFoodName];
    return image ? image : require('../../assets/images/placeHolder.png');
  };
  
  // for "expiring inventory section" 
  const foodItems = [
    { foodName: 'Apple', daysLeft: 1 },
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

      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          height={200}
          showsPagination={false}
        >
        {randomRecipes.map((recipe) => (
           <View style={styles.slide}>
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
          </View>
        ))} 
        </Swiper>
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
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderContainer: {
    height: 200,
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },
});


export default Home;






// {randomRecipes.map((recipe) => (
//   <TouchableOpacity
//     key={recipe.id}
//     style={styles.recipeContainer}
//     onPress={() => router.push({
//       pathname: '../(other)/showRecipe',
//       params: {
//         id: recipe.id,
//         name: recipe.name,
//         // image: recipe.image,
//         image: Image.resolveAssetSource(recipe.image).uri,
//         details: JSON.stringify(recipe.details),
//         path: '../(tabs)/home',
//       },
//     })}
//   >
//     <View style={styles.imageContainer}>
//       {/* <Image source={{ uri: recipe.image }} style={styles.recipeImage} /> */}
//       <Image source={recipe.image} style={styles.recipeImage} />
//       <Text style={styles.recipeText}>{recipe.name}</Text>
//     </View>
//   </TouchableOpacity>
// ))}