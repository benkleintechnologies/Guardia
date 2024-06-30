import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from '../screens/Auth';
import MainScreen from '../screens/Main';
import { useAuth } from '../hooks/useAuth';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();

  useEffect(() => {
    console.log('AppNavigator effect running');
    checkAuthStatus();
  }, [checkAuthStatus]);

  console.log('Rendering AppNavigator, isAuthenticated:', isAuthenticated);

  if (isAuthenticated === null) {
    console.log('Authentication state is null, returning null');
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
