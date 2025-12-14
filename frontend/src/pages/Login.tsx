import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Input from '../components/Input';
import Button from '../components/Button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sweet Shop Login</h2>
                <form onSubmit={handleLogin}>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    <Button type="submit" style={{ width: '100%' }}>Login</Button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)' }}>Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
