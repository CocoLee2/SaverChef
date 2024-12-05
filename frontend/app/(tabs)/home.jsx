import { React, useState, useRef, useContext, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { GlobalContext } from "../GlobalContext";
import userImage from '../../assets/images/userImage.webp';
import InfoBox from '../../components/InfoBox.jsx';
import images from '../../constants/images';
// import axios from 'axios';

const Home = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);

    // used for send notifications
    //  useEffect(() => {
    //   if (expoPushToken && userId) {
    //     registerPushToken(userId, expoPushToken);
    //   }
    // }, [expoPushToken, userId]);
  
    // async function registerPushToken(userId, token) {
    //   try {
    //     const response = await axios.post('https://127.0.0.1:5001/register-token', {
    //       user_id: userId,
    //       token: token,
    //     });
    //     console.log('Push token registered:', response.data.message);
    //   } catch (error) {
    //     console.error('Error registering push token:', error);
    //   }


  // // used for debugging fridgeItems and setFridgeItems
  // console.log("line15 in home.jsx")
  // console.log(fridgeItems)

  const getImage = (foodName) => {
    const normalizeName = (name) => {
      let lowerName = name.toLowerCase();
      if (lowerName.endsWith("es")) {
        return lowerName.slice(0, -2); // Remove "es"
      } else if (lowerName.endsWith("s")) {
        return lowerName.slice(0, -1); // Remove "s"
      }
      return lowerName;
    };
     const sanitizedFoodName = foodName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    let image = images[sanitizedFoodName];
    if (!image) {
      const normalizedFoodName = normalizeName(sanitizedFoodName);
      image = images[normalizedFoodName];
    }
    return image ? image : require('../../assets/images/placeHolder.png');
  };
 
  
  function getExpiringItems(fridgeItems) {
    const expiringItems = [];
    fridgeItems.forEach((fridge) => {
      // Correctly access the fridgeItems array
      fridge.fridgeItems.forEach((item) => {
        const currentDate = new Date();
        const bestBeforeDate = new Date(item.bestBefore);
        const daysLeft = Math.ceil((bestBeforeDate - currentDate) / (1000 * 60 * 60 * 24)) + 1; 
        if (daysLeft >= 0 && daysLeft <= 7) {
          expiringItems.push({ foodName: item.name, daysLeft: daysLeft});
        }
      });
    });
    return expiringItems;
  }
  const expiringItems = getExpiringItems(fridgeItems);
  console.log("expiring items are ", expiringItems);

  // Function to generate list of InfoBox components
  const renderExpiringItems = (items) => {
    if (items.length === 0) {
      return (
        <Text style={styles.placeholderText}>
          No items are expiring soon!
        </Text>
      );
    }

    return items.map((item, index) => {
      const daysLeftText = item.daysLeft === 0 ? "Today" : `in ${item.daysLeft} days`;
      return (
        <InfoBox
          key={index}
          title={item.foodName}
          daysLeft={daysLeftText}
          image={getImage(item.foodName)}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* User welcome text and image */}
      <View style={styles.headerContainer}>
        {/* currently only showing the first six letters in username */}
        <Text style={styles.welcomeText}>Welcome, {username.slice(0,6)}!</Text>
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
          <View key={recipe.id} style={styles.slide}>
          <TouchableOpacity
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
          {renderExpiringItems(expiringItems)}
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
    paddingTop: '20%',
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
  placeholderText: {
    marginTop: 10,
    fontSize: 18,
    color: '#888',
  },
});


export default Home;