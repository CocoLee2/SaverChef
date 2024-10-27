import React, { createContext, useState } from 'react';

// Create the context
export const GlobalContext = createContext(); // No default values, handled by provider

// Create the provider component
export const GlobalProvider = ({ children }) => {
  // State values for username, email, and password
  const [username, setUsername] = useState('Initial username');
  const [email, setEmail] = useState('Initial email');
  const [password, setPassword] = useState('Initial password');

  // Provide the values and update functions
  return (
    <GlobalContext.Provider value={{ username, setUsername, email, setEmail, password, setPassword }}>
      {children}
    </GlobalContext.Provider>
  );
};
