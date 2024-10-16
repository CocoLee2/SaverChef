import React from 'react';
import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,  // Ensure the header is hidden globally
          tabBarActiveTintColor: '#F36C21',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderRadius: 10,
            borderTopWidth: 1,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false, // Disable header specifically for this screen (redundant but safe)
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="inventory"
          options={{
            title: "Inventory",
            headerShown: false, // Disable header for this screen
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="food-apple-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="recipes"
          options={{
            title: "Recipes",
            headerShown: false, // Disable header for this screen
            tabBarIcon: ({ color }) => (
              <AntDesign name="filetext1" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false, // Disable header for this screen
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
