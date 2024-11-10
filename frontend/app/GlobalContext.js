import React, { createContext, useState } from 'react';

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
        {itemId: 1, itemName: "Apple", expirationDate: 2024-11-1, quantity: 1, quantifier: "pcs"},
        {itemId: 3, itemName: "Egg", expirationDate: 2024-11-1, quantity: 1, quantifier: "pcs"},
        {itemId: 10, itemName: "Flour", expirationDate: 2024-11-1, quantity: 1, quantifier: "lbs"},
       ]
      },
      { fridge: 2,
        fridgeName: "Fridge 2",
        fridgeItems: [
         {itemId: 11, itemName: "Avocado", expirationDate: 2024-11-1, quantity: 1, quantifier: "pcs"},
         {itemId: 25, itemName: "Asparagus", expirationDate: 2024-11-1, quantity: 1, quantifier: "lbs"},
         {itemId: 37, itemName: "Beef", expirationDate: 2024-11-1, quantity: 1, quantifier: "pcs"},
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
