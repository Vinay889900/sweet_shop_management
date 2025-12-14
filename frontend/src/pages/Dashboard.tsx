import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

const Dashboard: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [cart, setCart] = useState<{ sweet: Sweet; quantity: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeView, setActiveView] = useState('Home');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = ['All', ...new Set(sweets.map(s => s.category))];
    const filteredSweets = selectedCategory === 'All' ? sweets : sweets.filter(s => s.category === selectedCategory);

    const fetchSweets = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            setLoading(true);
            const url = 'http://localhost:3000/api/sweets';
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSweets(res.data);
        } catch (err: any) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/login');
            } else {
                alert('Failed to load sweets.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const addToCart = (sweet: Sweet) => {
        setCart(prev => {
            const existing = prev.find(item => item.sweet.id === sweet.id);
            if (existing) {
                if (existing.quantity >= sweet.quantity) {
                    alert('Cannot add more than available stock!');
                    return prev;
                }
                return prev.map(item =>
                    item.sweet.id === sweet.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { sweet, quantity: 1 }];
        });
        setIsCartOpen(true); // Auto open cart
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.sweet.id !== id));
    };

    const checkout = async () => {
        const token = localStorage.getItem('token');
        try {
            const items = cart.map(item => ({ sweetId: item.sweet.id, quantity: item.quantity }));
            await axios.post('http://localhost:3000/api/cart/checkout', { items }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Checkout Successful! Enjoy your sweets!');
            setCart([]);
            setIsCartOpen(false);
            fetchSweets(); // Refresh stock
        } catch (err: any) {
            alert('Checkout Failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Sweet Shop <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>({localStorage.getItem('role')})</span></h1>
                </div>

                {/* Navigation Menu */}
                <nav style={{ display: 'flex', gap: '2rem' }}>
                    {['Home', 'About Us', 'Products', 'Services', 'Contact us'].map(item => (
                        <span key={item}
                            onClick={() => setActiveView(item)}
                            style={{
                                cursor: 'pointer',
                                opacity: activeView === item ? 1 : 0.7,
                                fontWeight: activeView === item ? 'bold' : 'normal',
                                borderBottom: activeView === item ? '2px solid var(--color-accent)' : 'none'
                            }}>
                            {item}
                        </span>
                    ))}
                </nav>

                <div>
                    {localStorage.getItem('role') === 'ADMIN' && (
                        <Button onClick={() => navigate('/admin')} style={{ marginRight: '1rem' }} variant="primary">Admin</Button>
                    )}
                    <Button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login'); }} variant="secondary">Logout</Button>
                </div>
            </div>

            {activeView === 'Home' && (
                <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                    <div className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>Welcome to Sweet Shop 🍬</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                            Experience the future of sweet shop management. Simple. Efficient. Delightful.
                        </p>
                        <Button
                            variant="primary"
                            style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '50px', background: 'var(--gradient-main)', border: 'none' }}
                            onClick={() => setActiveView('Products')}
                        >
                            🍩 Explore Sweets
                        </Button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontSize: '1.5rem' }}>🚀 Capabilities</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Manage Inventory', 'Track Sales', 'Customer Insights', 'Billing & Orders'].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ color: 'var(--color-accent)', fontSize: '1.2rem' }}>❖</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', fontSize: '1.5rem' }}>✨ Highlights</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Lightning Fast', 'Secure & Reliable', 'User Friendly', 'Real-time Updates'].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}>★</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '2px solid var(--color-primary)' }}>
                        <h3 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯 Our Vision</h3>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>Empowering sweet traditions with modern innovation.</p>
                    </div>
                </div>
            )}

            {activeView === 'Products' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: selectedCategory === cat ? 'var(--gradient-main)' : 'rgba(255, 255, 255, 0.05)',
                                    color: selectedCategory === cat ? 'white' : 'var(--color-text-muted)',
                                    fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                            <p style={{ marginTop: '1rem', opacity: 0.7 }}>Loading sweets...</p>
                        </div>
                    ) : filteredSweets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.7 }}>No sweets found in this category.</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {filteredSweets.map((sweet: any) => (
                                <div key={sweet.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={sweet.imageUrl || 'https://placehold.co/300x200?text=Sweet'}
                                            alt={sweet.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'var(--color-gold)',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {sweet.category}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.3rem', flex: 1 }}>{sweet.name}</h3>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '12px',
                                                background: sweet.quantity < 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                color: sweet.quantity < 10 ? '#ef4444' : 'var(--color-text-muted)',
                                                border: sweet.quantity < 10 ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '0.5rem'
                                            }}>
                                                {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} left`}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', flex: 1 }}>
                                            Delicious handmade {sweet.name.toLowerCase()} for every occasion.
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>${sweet.price}</span>
                                            <Button
                                                onClick={() => addToCart(sweet)}
                                                disabled={sweet.quantity === 0}
                                                style={{
                                                    background: sweet.quantity === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                                    border: sweet.quantity === 0 ? '1px solid transparent' : '1px solid var(--color-primary)',
                                                    color: sweet.quantity === 0 ? 'var(--color-text-muted)' : 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    cursor: sweet.quantity === 0 ? 'not-allowed' : 'pointer',
                                                    opacity: sweet.quantity === 0 ? 0.6 : 1
                                                }}
                                                onMouseOver={(e) => {
                                                    if (sweet.quantity > 0) {
                                                        e.currentTarget.style.background = 'var(--color-primary)';
                                                        e.currentTarget.style.border = '1px solid var(--color-primary)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (sweet.quantity > 0) {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                        e.currentTarget.style.border = '1px solid var(--color-primary)';
                                                    }
                                                }}
                                            >
                                                {sweet.quantity === 0 ? 'Sold Out' : 'Add to Cart'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeView === 'About Us' && (
                <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🍬 About Us</h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            The Sweet Shop Management System is a simple and user-friendly application designed to help sweet shop owners manage their daily business operations efficiently.
                        </p>
                        <br />
                        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            This system helps in handling products, sales, inventory, billing, and customer details in a digital way, reducing manual work and errors.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--color-accent)' }}>🎯 Our Mission</h3>
                            <p>Our mission is to provide an easy, fast, and reliable management system that improves productivity and saves time for sweet shop owners.</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--color-accent)' }}>👁️ Our Vision</h3>
                            <p>To support small and medium sweet shops by bringing digital transformation to traditional business operations.</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--color-accent)', textAlign: 'center', marginBottom: '1.5rem' }}>💡 Why Choose Our System?</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                            {['Simple and easy to use', 'Reduces paperwork', 'Improves accuracy', 'Saves time and effort', 'Beginner-friendly design'].map((item, i) => (
                                <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px' }}>✅ {item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )
            }

            {
                activeView === 'Services' && (
                    <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.6' }}>
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🛠️ Our Services</h2>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                                The Sweet Shop Management System provides the following services to simplify and manage sweet shop operations efficiently:
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>🍩 Product Management</h3>
                                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.9 }}>
                                    <li>• Add, update, and delete sweet items</li>
                                    <li>• Manage prices and categories</li>
                                    <li>• View available products</li>
                                </ul>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📦 Inventory Management</h3>
                                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.9 }}>
                                    <li>• Track stock levels in real time</li>
                                    <li>• Get alerts for low stock</li>
                                    <li>• Avoid overstocking or shortages</li>
                                </ul>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>🧾 Billing & Invoicing</h3>
                                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.9 }}>
                                    <li>• Fast and accurate bill generation</li>
                                    <li>• Automatic price calculations</li>
                                    <li>• Printable invoices</li>
                                </ul>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>👥 Customer Management</h3>
                                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.9 }}>
                                    <li>• Store customer details</li>
                                    <li>• View purchase history</li>
                                    <li>• Improve customer service</li>
                                </ul>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📊 Sales Reports</h3>
                                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.9 }}>
                                    <li>• Daily and monthly sales reports</li>
                                    <li>• Track revenue easily</li>
                                    <li>• Better business analysis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                activeView === 'Contact us' && (
                    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📞 Contact Us</h2>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                                We are always happy to help you. If you have any questions, feedback, or suggestions related to the Sweet Shop Management System, please feel free to contact us.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>📍 Our Details</h3>
                                <p><strong>Sweet Shop Name:</strong> Sweet Delight</p>
                                <p><strong>Address:</strong> Main Road, City Name, State</p>
                                <p><strong>Phone:</strong> +91 9XXXXXXXXX</p>
                                <p><strong>Email:</strong> sweetshop@gmail.com</p>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>🕒 Working Hours</h3>
                                <p><strong>Monday – Saturday:</strong> 9:00 AM – 9:00 PM</p>
                                <p><strong>Sunday:</strong> Closed</p>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>💬 Get in Touch</h3>
                            <p>You can reach us for:</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px' }}>System support</span>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px' }}>Technical queries</span>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px' }}>Feedback & suggestions</span>
                            </div>
                            <p style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>We will try our best to respond as soon as possible.</p>
                        </div>

                        <div style={{ textAlign: 'center', opacity: 0.8 }}>
                            <h3>😊 Thank You</h3>
                            <p>Thank you for using our Sweet Shop Management System.</p>
                        </div>
                    </div>
                )
            }

            {/* Cart UI */}
            <button className="cart-fab" onClick={() => setIsCartOpen(true)}>
                🛒
                {cart.length > 0 && <span className="cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
            </button>

            <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ margin: 0 }}>Your Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.sweet.id} className="cart-item">
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{item.sweet.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>${item.sweet.price} x {item.quantity}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span>${(item.sweet.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.sweet.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Button
                        variant="primary"
                        style={{ width: '100%', padding: '1rem' }}
                        disabled={cart.length === 0}
                        onClick={checkout}
                    >
                        Checkout (${total.toFixed(2)})
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
