import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Clipboard, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { GlobalContext } from "../GlobalContext";
// import { format } from 'date-fns';

const Share = () => {
  const { passcode } = useLocalSearchParams();
  // will use userId and setFridgeItems later on
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
        fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);
  const [inputPasscode, setInputPasscode] = useState("");

  const copyToClipboard = () => {
    Clipboard.setString(passcode);
    Alert.alert('Link Copied', 'The link has been copied to your clipboard.');
  };

  const processFridgeData = (fridgeData) => {
    return fridgeData.map(fridge => {
      const processedItems = fridge.fridgeItems.map(item => {
        const expirationDate = new Date(item.expiration_date);
        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.quantifier,
          bestBefore: new Date(
            expirationDate.getFullYear(),
            expirationDate.getMonth(),
            expirationDate.getDate()+1
          ),
        };
      });
  
      return {
        fridgeId: fridge.fridgeId,
        fridgeName: fridge.fridgeName,
        fridgeItems: processedItems,
        fridgePasscode: fridge.fridgePasscode
      };
    });
  };

  const joinFridge = async() => {
    // checks if the input fridge passcode is empty
    if (inputPasscode.trim()) {
      try {
        const response = await fetch('http://127.0.0.1:5001/fridge/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,  
            fridgePasscode: inputPasscode.trim(),
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          // Update the fridge items with the data returned from the server
          if (fridgeItems.length === 0) {
            setFridgeItems((prevFridgeItems) => [...prevFridgeItems, processFridgeData(data["fridgeData"])]);
          } else {
            setFridgeItems(processFridgeData(data["fridgeData"]));
          }
          Alert.alert('Success', 'You have joined the fridge successfully!');
          router.push("../(tabs)/inventory");
          return;
        } else {
          // Handle specific error cases based on response status
          switch (response.status) {
            case 409:
              Alert.alert('Error', data.message || 'You already have access to this fridge.');
              return;
            case 404:
              Alert.alert('Error', data.message || 'The fridge passcode is invalid.');
              return;
            default:
              Alert.alert('Error', data.message || 'Request failed. Please try again.');
              return;
          }
          // Navigate the user to the inventory page if needed
          // router.push("../(tabs)/inventory");
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Network Error', 'Something went wrong. Please try again later.');
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid fridge passcode.');
    }
  }

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#F36C21" />
            </TouchableOpacity>
        </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shareable passcode</Text>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>{passcode}</Text>
          {passcode !== "no selected fridge" && (
            <TouchableOpacity onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={24} color="#F36C21" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share via passcode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter passcode"
          value={inputPasscode}
          onChangeText={setInputPasscode}
        />
        <TouchableOpacity style={styles.shareButton} onPress={joinFridge}>
          <Text style={styles.shareButtonText}>join fridge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingHorizontal: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 30,
  },

  backButton: {
    marginRight: 10,
  },

  section: {
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F36C21',
  },

  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  linkText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },

  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    marginBottom: 20,
  },

  shareButton: {
    backgroundColor: '#F36C21',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  shareButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Share;
