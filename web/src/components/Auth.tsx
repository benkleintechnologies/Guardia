// src/components/Auth.tsx
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const Auth = () => {
    const { signUp, signIn, signOut, currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            alert('User created successfully');
        } catch (error) {
            alert('Error signing up');
        }
    };

    const handleSignIn = async () => {
        try {
            await signIn(email, password);
            alert('Signed in successfully');
        } catch (error) {
            alert('Error signing in');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            alert('Signed out successfully');
        } catch (error) {
            alert('Error signing out');
        }
    };

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
                <Button variant="contained" color="primary" onClick={handleSignUp}>
                    Sign Up
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSignIn}>
                    Sign In
                </Button>
                {currentUser && (
                    <Button variant="outlined" color="inherit" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Auth;