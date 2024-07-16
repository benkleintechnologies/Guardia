// src/components/Auth.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
    const { signUp, signIn, signOut, currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [teamId, setTeamId] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            if (isSignUp) {
                await signUp(name, email, password, teamId);
                console.log('User created successfully');
            } else {
                await signIn(email, password);
                console.log('Signed in successfully');
            }
            navigate('/dashboard');
        } catch (error) {
            alert(`Error ${isSignUp ? 'signing up' : 'signing in'}`);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log('Signed out successfully');
            navigate('/auth');
        } catch (error) {
            alert('Error signing out');
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleAuth();
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
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
                {isSignUp ? 'Sign Up' : 'Sign In'}
            </Typography>
            {isSignUp && (
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
            )}
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                required
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                required
            />
            {isSignUp && (
                <TextField
                    label="Team ID"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 2, width: '100%' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
                <Button
                    onClick={() => setIsSignUp(!isSignUp)}
                    sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
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