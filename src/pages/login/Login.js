import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../../assets/image/logo_main.png';
import '../../assets/css/_login.css';
import Auth from '../../service/Auth';

const Login = ({ onLogin }) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Inisialisasi useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
    
        const dataAuth = {
            username: user,
            password: password,
            refreshToken: "", 
        };
        console.log("Login Payload:", dataAuth);
        try {
            const response = await Auth.post('/auth/signin', dataAuth);
            console.log('Login Response:', response.data);
            onLogin();
            localStorage.setItem('data', JSON.stringify(response.data.authorities));
            navigate('/');
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Login failed.');
        }
    };
    

    return (
        <div className="login-container">
            {/* Bagian Kiri - Gambar */}
            <div className="login-image" />

            {/* Garis Pembatas */}
            <div className="login-divider" />

            {/* Bagian Kanan - Form Login */}
            <div className="login-form-container">
                <img
                    src={logo}
                    alt="Logo"
                    className="login-logo"
                />
                <Typography component="h1" variant="h5" className="login-title">
                    SignIn
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleLogin} className="login-form">
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="user"
                        label="Email Address"
                        name="user"
                        autoComplete="user"
                        autoFocus
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default Login;
