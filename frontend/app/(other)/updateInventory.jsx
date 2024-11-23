import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { React, useContext } from 'react';
import CustomButton from '../../components/CustomButton'
import { GlobalContext } from "../GlobalContext";
import { Ionicons } from '@expo/vector-icons';

const UpdateInventory = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);
  const { matchedItemsString } = useLocalSearchParams();
  const router = useRouter();
  
  console.log(matchedItemsString);
  const matchedItems = JSON.parse(matchedItemsString);
  console.log(matchedItems);



  return (
    <View className="bg-primary h-full">
        {/* Back Arrow */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#F36C21" />
            </TouchableOpacity>
        </View>

    </View>
  )
}

export default UpdateInventory

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  customContainer: {
    width: '80%',
    marginTop: 40, 
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2, // Ensure the back arrow is above everything else
  },
});