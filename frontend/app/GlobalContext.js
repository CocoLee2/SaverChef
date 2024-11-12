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
  // fridgeItems and favoriteRecipes will be replaced with empty list later 
  const [fridgeItems, setFridgeItems] = useState(
    [
      {fridgeId: 1,
       fridgeName: "Fridge 1",
       fridgeItems: [
        {id: 1, name: "Apple", quantity: 1, unit: "pcs", bestBefore: new Date(2024, 12, 10)},
        {id: 3, name: "Egg",  quantity: 3, unit: "pcs", bestBefore: new Date(2024, 11, 17)},
        {id: 10, name: "Flour", quantity: 1, unit: "lbs", bestBefore: new Date(2024, 11, 20)},
       ]
      },
      { fridgeId: 2,
        fridgeName: "Fridge 2",
        fridgeItems: [
         {id: 11, name: "Avocado", quantity: 2, unit: "pcs", bestBefore: new Date(2024, 11, 22)},
         {id: 25, name: "Asparagus", quantity: 1, unit: "lbs", bestBefore: new Date(2024, 11, 16)},
         {id: 37, name: "Beef", quantity: 2, unit: "pcs", bestBefore: new Date(2024, 11, 23)},
        ]
      }
    ]
  );
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
