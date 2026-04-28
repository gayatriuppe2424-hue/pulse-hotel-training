import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { Activity, Mail, Lock, User, AlertCircle, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { login, signup, loginWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>('trainee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect to home
    if (user) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password, role);
            } else {
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                await signup(email, password, name, role);
            }
            navigate('/');
        } catch (err: any) {
            // Clean up Firebase error messages
            const msg = err.message || 'Failed to authenticate';
            if (msg.includes('auth/invalid-credential')) {
                setError('Invalid email or password');
            } else if (msg.includes('auth/email-already-in-use')) {
                setError('An account with this email already exists');
            } else if (msg.includes('auth/weak-password')) {
                setError('Password must be at least 6 characters');
            } else if (msg.includes('auth/invalid-email')) {
                setError('Please enter a valid email address');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle(role);
            navigate('/');
        } catch (err: any) {
            setLoading(false);
            const msg = err.message || 'Google sign-in failed';
            if (msg.includes('popup-closed')) {
                setError('Sign-in popup was closed');
            } else {
                setError(msg);
            }
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

                {/* Role Selector */}
                <div style={styles.roleContainer}>
                    <p style={styles.roleLabel}>Select Your Role</p>
                    <div style={styles.roleButtons}>
                        <button
                            type="button"
                            onClick={() => setRole('trainee')}
                            style={{
                                ...styles.roleBtn,
                                ...(role === 'trainee' ? styles.roleBtnActive : {}),
                            }}
                        >
                            <GraduationCap size={20} />
                            <span>Trainee</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('manager')}
                            style={{
                                ...styles.roleBtn,
                                ...(role === 'manager' ? styles.roleBtnManager : {}),
                            }}
                        >
                            <ShieldCheck size={20} />
                            <span>Manager</span>
                        </button>
                    </div>
                </div>

                {/* Google Sign-In Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={styles.googleBtn}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div style={styles.divider}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>or</span>
                    <div style={styles.dividerLine}></div>
                </div>

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
                            placeholder="Password (min 6 characters)" 
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
        maxWidth: '420px',
        padding: '2.5rem 2rem',
        margin: '1rem',
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
        marginBottom: '1.5rem'
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
        marginBottom: '1.5rem'
    },
    errorBox: {
        backgroundColor: 'rgba(255,51,68,0.1)',
        color: '#FF3344',
        padding: '0.85rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1.25rem',
        fontSize: '0.85rem',
        border: '1px solid rgba(255,51,68,0.2)',
        textAlign: 'left' as const
    },
    roleContainer: {
        marginBottom: '1.25rem'
    },
    roleLabel: {
        color: '#8E9BAE',
        fontSize: '0.7rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '0.6rem'
    },
    roleButtons: {
        display: 'flex',
        gap: '0.75rem'
    },
    roleBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '2px solid rgba(255,255,255,0.08)',
        backgroundColor: '#1A1E26',
        color: '#8E9BAE',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    roleBtnActive: {
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: '#3B82F6',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
    },
    roleBtnManager: {
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        color: '#F59E0B',
        boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
    },
    googleBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.85rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.12)',
        backgroundColor: '#1A1E26',
        color: '#FFF',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginBottom: '0'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '1.25rem 0'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(255,255,255,0.08)'
    },
    dividerText: {
        color: '#8E9BAE',
        fontSize: '0.8rem',
        fontWeight: '500'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
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
        padding: '0.9rem 1rem 0.9rem 3rem',
        backgroundColor: '#1A1E26',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: '#FFF',
        fontSize: '0.95rem',
        outline: 'none'
    },
    btn: {
        width: '100%',
        padding: '0.9rem',
        backgroundColor: '#FF3344',
        color: '#FFF',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '0.5rem',
        transition: 'transform 0.2s'
    },
    toggleText: {
        color: '#8E9BAE',
        marginTop: '1.5rem',
        fontSize: '0.9rem'
    },
    toggleLink: {
        color: '#FFF',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};
