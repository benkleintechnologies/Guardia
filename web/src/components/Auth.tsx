// src/components/Auth.tsx
import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Box, Button, TextField, Typography } from '@mui/material';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('User created successfully');
        console.log('User created:', auth.currentUser);
    } catch (error) {
        console.error('Error signing up:', error);
        alert('Error signing up');
    }
    };

    const signIn = async () => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Signed in successfully');
        console.log('Signed in user:', auth.currentUser);
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Error signing in');
    }
    };

    const handleSignOut = async () => {
    try {
        await signOut(auth);
        alert('Signed out successfully');
        console.log('Signed out');
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out');
    }
    };

    // Render your form here
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: 2,
            }}
        >
            <Typography variant="h4" component="h2" gutterBottom>
                Authentication
            </Typography>
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={signUp}>
                    Sign Up
                </Button>
                <Button variant="contained" color="secondary" onClick={signIn}>
                    Sign In
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </Box>
        </Box>
    );

};