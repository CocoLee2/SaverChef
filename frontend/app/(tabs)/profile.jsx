import { StatusBar, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, router } from "expo-router";
import userImage from '../../assets/images/userImage.webp';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';


const Profile = () => {
  const notification = false

  // todo: functions/transform to other pages
  const handleGetFavoriteRecipes = () => {
    console.log("Change Password clicked");
  };
  
  const handleChangePassword = () => {
    console.log("Change Password clicked");
  };

  const handleTurnOnNotification = () => {
    console.log("Turn On Notification clicked");
  };

  // const handleLogOut = () => {
  //   console.log("Log Out clicked");
  // };

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
        {/* todo */}
        <TouchableOpacity onPress={handleGetFavoriteRecipes} style={styles.listItem}>
          <MaterialIcons name="password" size={24} color="black" style={styles.icon}  />
          <Text style={styles.listItemText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleChangePassword} style={styles.listItem}>
          <MaterialIcons name="password" size={24} color="black" style={styles.icon}  />
          <Text style={styles.listItemText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTurnOnNotification} style={styles.listItem}>
          {/* todo: show different text and icon */}
          <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon}/>
          {/* <Ionicons name="notifications-off-outline" size={24} color="black" style={styles.icon}/> */}
          <Text style={styles.listItemText}>Turn On Notification</Text>
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
    width: '90%',
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