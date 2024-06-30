import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { signIn as apiSignIn, signUp as apiSignUp } from '../services/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';

type AuthScreenProps = {
  navigation: StackNavigationProp<any>;
};

const Auth: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, isAuthenticated } = useAuth();

  console.log('Auth component rendering, isAuthenticated:', isAuthenticated);

  const handleAuth = async () => {
    try{ 
      let userId: string = "";
      if (isSignUp) {
          userId = await apiSignUp(email, password, teamId);
          console.log('Sign up successful, userId:', userId);
      } else {
          userId = await apiSignIn(email, password);
          console.log('Sign in successful, userId:', userId);
      }

      // Use the signIn function from useAuth hook
      await signIn(userId);
      console.log('Authentication state updated');
      console.log('Authentication Successful', `UserId: ${userId}`);
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
      Alert.alert('Authentication Error', 'Authentication failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Text>
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
      <Button mode="contained" onPress={handleAuth} style={styles.button}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
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