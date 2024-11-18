import React, { createContext, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';


// Create the context
export const GlobalContext = createContext(); // No default values, handled by provider

// Create the provider component
export const GlobalProvider = ({ children }) => {
  // State values for username, email, and password
  const [userId, setUserId] = useState(0)
  const [username, setUsername] = useState('Initial username');
  const [email, setEmail] = useState('Initial email');
  const [password, setPassword] = useState('Initial password');
  const [fridgeItems, setFridgeItems] = useState([])
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [randomRecipes, setRandomRecipes] = useState([])
  
  // Provide the values and update functions
  return (
    <GlobalContext.Provider value={{ userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
      fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes }}>
      {children}
    </GlobalContext.Provider>
  );
};
