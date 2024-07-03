/**
 * Auth.tsx
 * 
 * This component handles user authentication (sign in and sign up) for the application.
 * It uses React Native Paper for UI components and integrates with a custom authentication service.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { signIn as apiSignIn, signUp as apiSignUp } from '../services/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';

type AuthScreenProps = {
  navigation: StackNavigationProp<any>;
};

/**
 * Auth Component
 * 
 * This component renders a form for user authentication, allowing users to sign in or sign up.
 * It switches between sign in and sign up modes based on user interaction.
 * 
 * @param navigation - Navigation prop from React Navigation
 */
const Auth: React.FC<AuthScreenProps> = ({ navigation }) => {
  // State variables for form inputs and mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Custom hook for authentication
  const { signIn, isAuthenticated } = useAuth();

  console.log('Auth component rendering, isAuthenticated:', isAuthenticated);

  /**
   * Handles the authentication process (sign in or sign up)
   */
  const handleAuth = async () => {
    try{ 
      let userId: string = "";
      let teamId: string = "";
      if (isSignUp) {
          // Call sign up API
          [userId, teamId] = await apiSignUp(email, password, teamId);
          console.log('Sign up successful, userId:', userId);
      } else {
          // Call sign in API
          [userId, teamId] = await apiSignIn(email, password);
          console.log('Sign in successful, userId:', userId);
      }

      // Update authentication state
      await signIn(userId, teamId);
      console.log('Authentication state updated');
      console.log('Authentication Successful', `UserId: ${userId}`);
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication Error', 'Authentication failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Text>
      {/* Form inputs */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      {isSignUp && (
        <TextInput
          label="Team ID"
          value={teamId}
          onChangeText={setTeamId}
          mode="outlined"
          style={styles.input}
        />
      )}
      {/* Authentication button */}
      <Button mode="contained" onPress={handleAuth} style={styles.button}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
      {/* Toggle between sign in and sign up */}
      <Button
        mode="text"
        onPress={() => setIsSignUp(!isSignUp)}
        style={styles.switchButton}
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </Button>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  switchButton: {
    marginTop: 8,
  },
});

export default Auth;