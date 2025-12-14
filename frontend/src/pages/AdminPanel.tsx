import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
    const [sweets, setSweets] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/sweets');
            setSweets(res.data);
        } catch (err) {
            console.error('Failed to fetch sweets');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const data = {
            name,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            imageUrl: imageUrl || undefined
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:3000/api/sweets/${editingId}`, data, { headers });
                alert('Sweet updated!');
            } else {
                await axios.post('http://localhost:3000/api/sweets', data, { headers });
                alert('Sweet added!');
            }
            resetForm();
            fetchSweets();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (sweet: any) => {
        setName(sweet.name);
        setCategory(sweet.category);
        setPrice(sweet.price.toString());
        setQuantity(sweet.quantity.toString());
        setImageUrl(sweet.imageUrl || '');
        setEditingId(sweet.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this sweet?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/sweets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSweets();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete');
        }
    };

    const resetForm = () => {
        setName('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setImageUrl('');
        setEditingId(null);
    };

    return (
        <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem' }}>
                    Admin Panel
                </h1>
                <Button onClick={() => navigate('/dashboard')} variant="secondary">Back to Dashboard</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
                {/* Form Section */}
                <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                        {editingId ? 'Edit Sweet' : 'Add New Sweet'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name</label>
                            <Input placeholder="Sweet Name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                            <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price ($)</label>
                                <Input placeholder="0.00" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Stock</label>
                                <Input placeholder="Qty" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Image URL (Optional)</label>
                            <Input placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button type="submit" variant="primary" style={{ flex: 1 }}>
                                {editingId ? 'Update Sweet' : 'Add Sweet'}
                            </Button>
                            {editingId && (
                                <Button type="button" onClick={resetForm} variant="secondary">
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>Inventory ({sweets.length})</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Category</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Price</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Stock</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sweets.map((sweet) => (
                                    <tr key={sweet.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{sweet.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '15px', background: 'rgba(255,255,255,0.1)' }}>
                                                {sweet.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-primary)' }}>${sweet.price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ color: sweet.quantity < 10 ? '#ef4444' : 'inherit' }}>
                                                {sweet.quantity}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(sweet)}
                                                style={{ background: 'var(--color-primary)', border: 'none', borderRadius: '5px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sweet.id)}
                                                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '5px', padding: '0.4rem 0.8rem', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {sweets.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No sweets found. Add some!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
