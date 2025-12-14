import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Input from '../components/Input';
import Button from '../components/Button';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                <form onSubmit={handleRegister}>
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
                    <Button type="submit" style={{ width: '100%' }}>Register</Button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p>Already have an account? <Link to="/login" style={{ color: 'var(--color-accent)' }}>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
