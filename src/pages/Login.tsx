import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, name);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoContainer}>
                    <Activity color="#FF3344" size={40} />
                    <h1 style={styles.brand}>PULSE</h1>
                </div>
                
                <h2 style={styles.subtitle}>
                    {isLogin ? 'Sign in to Continue Training' : 'Create Staff Account'}
                </h2>

                {error && (
                    <div style={styles.errorBox}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <div style={styles.inputGroup}>
                            <User size={20} color="#8E9BAE" style={styles.icon} />
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                style={styles.input}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required 
                            />
                        </div>
                    )}
                    
                    <div style={styles.inputGroup}>
                        <Mail size={20} color="#8E9BAE" style={styles.icon} />
                        <input 
                            type="email" 
                            placeholder="Staff Email" 
                            style={styles.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <Lock size={20} color="#8E9BAE" style={styles.icon} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={styles.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" style={styles.btn} disabled={loading}>
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
                    </button>
                </form>

                <p style={styles.toggleText}>
                    {isLogin ? "Don't have an account? " : "Already registered? "}
                    <span style={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign up' : 'Log in'}
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B0D11',
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,51,68,0.1), transparent 50%)',
        fontFamily: "'Inter', sans-serif"
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        padding: '3rem 2rem',
        backgroundColor: '#12151B',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '2rem'
    },
    brand: {
        color: '#FFF',
        fontSize: '2rem',
        fontWeight: '900',
        letterSpacing: '2px',
        margin: 0
    },
    subtitle: {
        color: '#8E9BAE',
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '2rem'
    },
    errorBox: {
        backgroundColor: 'rgba(255,51,68,0.1)',
        color: '#FF3344',
        padding: '1rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        border: '1px solid rgba(255,51,68,0.2)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        left: '16px'
    },
    input: {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        backgroundColor: '#1A1E26',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: '#FFF',
        fontSize: '1rem',
        outline: 'none'
    },
    btn: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#FF3344',
        color: '#FFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '1rem',
        transition: 'transform 0.2s'
    },
    toggleText: {
        color: '#8E9BAE',
        marginTop: '2rem',
        fontSize: '0.9rem'
    },
    toggleLink: {
        color: '#FFF',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};
