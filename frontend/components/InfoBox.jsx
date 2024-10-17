import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Ensure router is imported from expo-router

const InfoBox = ({ title, daysLeft, image }) => {
  return (
    <TouchableOpacity onPress={() => router.push("/inventory")} style={styles.container}>
      <Image source={image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Expire in {daysLeft} days</Text> 
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    color: '#3b3b3b',
  },
  subtitle: {
    fontSize: 13,
    color: '#A9A9A9',
  },
});

export default InfoBox;
