import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localDatabase from '../services/localDatabase';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('loggedUser');
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    loadUser();
  }, []);
  const login = async (email, password) => {
    setLoading(true);
    const foundUser = await localDatabase.loginUser(email, password);
    if (foundUser) {
      setUser(foundUser);
      await AsyncStorage.setItem('loggedUser', JSON.stringify(foundUser));
    }
    setLoading(false);
    return foundUser;
  };
  const register = async (name, email, password) => {
    setLoading(true);
    const newUser = await localDatabase.registerUser(name, email, password);
    if (newUser) {
      setUser(newUser);
      await AsyncStorage.setItem('loggedUser', JSON.stringify(newUser));
    }
    setLoading(false);
    return newUser;
  };
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('loggedUser');
  };
  const editProfile = async (updatedUser) => {
    const userEdited = await localDatabase.editUser(updatedUser);
    if (userEdited) {
      setUser(userEdited);
      await AsyncStorage.setItem('loggedUser', JSON.stringify(userEdited));
    }
    return userEdited;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, editProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
