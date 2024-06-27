import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { signIn, signUp } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Auth = ({ setUserId }: { setUserId: (id: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    try {
      let userId;
      if (isSignUp) {
        userId = await signUp(email, password, teamId);
      } else {
        userId = await signIn(email, password);
      }
      if (userId) {
        setUserId(userId);
        await AsyncStorage.setItem('userId', userId);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle error (show message to user)
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