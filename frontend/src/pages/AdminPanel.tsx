import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/api/sweets', {
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Sweet added!');
            setName('');
            setCategory('');
            setPrice('');
            setQuantity('');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to add sweet');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Button onClick={() => navigate('/dashboard')} variant="secondary">Back to Dashboard</Button>
            <h1>Admin Panel</h1>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '500px' }}>
                <h3>Add New Sweet</h3>
                <form onSubmit={handleAdd}>
                    <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                    <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
                    <Input placeholder="Price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                    <Input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                    <Button type="submit">Add Sweet</Button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;
