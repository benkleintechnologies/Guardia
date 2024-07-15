import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/Auth';
import MainScreen from '../screens/Main';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  console.log('Rendering AppNavigator, isAuthenticated:', isAuthenticated);

  if (isAuthenticated === null) {
    console.log('Auth status still loading. Showing loading screen.');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
