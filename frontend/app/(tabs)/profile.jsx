import { StatusBar, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { React, useState } from 'react';
import { Link, router } from "expo-router";
import userImage from '../../assets/images/userImage.webp';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';


const Profile = () => {
  const [notification, setNotification] = useState(false);

  // todo: functions/transform to other pages
  const handleGetFavoriteRecipes = () => {
    console.log("Favorite Recipes clicked");
  };
  
  const handleChangePassword = () => {
    console.log("Change Password clicked");
  };

  const handleNotification = () => {
    setNotification(!notification);
    console.log(notification ? "Notification off" : "Notification On");
  };

  const handleDeleteAccount = () => {
    console.log("Delete Account clicked");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.imageWrapper}>
        <Image
          source={userImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.username}>Nancy Cui</Text>
      <Text style={styles.email}>nancycui@example.com</Text>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleGetFavoriteRecipes} style={styles.listItem}>
          <MaterialIcons name="favorite-border" size={24} color="black" style={styles.icon} />
          <Text style={styles.listItemText}>My Favorite</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleChangePassword} style={styles.listItem}>
          <MaterialIcons name="password" size={24} color="black" style={styles.icon}  />
          <Text style={styles.listItemText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNotification} style={styles.listItem}>
          {notification ? (
            <Ionicons name="notifications-off-outline" size={24} color="black" style={styles.icon} />
          ) : (
            <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
          )}
          <Text style={styles.listItemText}>
            {notification ? "Turn Off Notification" : "Turn On Notification"}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => {router.push("../(auth)/logIn")}} style={styles.listItem}>
          <AntDesign name="logout" size={24} color="black" style={styles.icon} />
          <Text style={styles.listItemText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.listItem}>
        <AntDesign name="deleteuser" size={24} color="black" style={styles.icon} />
          <Text style={[styles.listItemText, styles.deleteText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 50,
    marginTop: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: 'rgba(16, 16, 16, 0.6)',
    marginTop: 5,
    textAlign: 'center',
  },
  actionsContainer: {
    marginTop: 30,
    width: '85%',
  },
  listItem: {
    backgroundColor: '#FFFFFF', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  deleteText: {
    color: '#F36C21', 
  },
  icon: {
    marginRight: 10, 
  },
});