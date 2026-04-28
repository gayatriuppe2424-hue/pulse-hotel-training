import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTopStaffMembers } from '../services/leaderboard';
import type { LeaderboardEntry } from '../services/leaderboard';
import { Activity, LayoutGrid, Award, LineChart, Play, Loader, Flame, Cross, ShieldAlert, LogOut, X, Trophy, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { MODULES } from '../data/mockScenarios';

// ==========================================
// LAYOUT SELECTOR: Change this value to preview different designs
// Set to 1, 2, or 3 to preview each layout
const ACTIVE_LAYOUT = 2;
// ==========================================

const TYPEWRITER_LINES = [
    'SYSTEM STATUS: ALL SECTORS OPTIMAL',
    'CURRENT VIGILANCE LEVEL: STANDARD',
    'WELCOME, LEAD SAFETY OPERATOR'
];

// ---- EKG Waveform SVG Component ----
const EKGWaveform = () => (
    <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '100%', opacity: 0.15 }}
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
    >
        <defs>
            <linearGradient id="ekgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                <stop offset="30%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="70%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
        </defs>
        <path
            d="M0,40 L80,40 L100,40 L110,15 L120,65 L130,10 L140,70 L150,40 L170,40 L250,40 L280,40 L290,20 L300,60 L310,5 L320,75 L330,40 L350,40 L430,40 L460,40 L470,18 L480,62 L490,12 L500,68 L510,40 L530,40 L610,40 L640,40 L650,22 L660,58 L670,8 L680,72 L690,40 L710,40 L790,40 L820,40 L830,16 L840,64 L850,6 L860,74 L870,40 L890,40 L970,40 L1000,40 L1010,20 L1020,60 L1030,10 L1040,70 L1050,40 L1070,40 L1150,40 L1200,40"
            fill="none"
            stroke="url(#ekgGrad)"
            strokeWidth="3"
        >
            <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-600,0"
                dur="8s"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);

// ---- Hotel Building Silhouette SVG ----
const HotelSilhouette = ({ isPulsing }: { isPulsing: boolean }) => (
    <svg
        style={{
            position: 'absolute',
            right: '30px',
            bottom: '10px',
            width: '140px',
            height: '120px',
            opacity: 0.15,
            filter: `drop-shadow(0 0 ${isPulsing ? '12px' : '6px'} rgba(59,130,246,0.6))`,
            transition: 'filter 0.6s ease, opacity 0.6s ease',
            ...(isPulsing ? { opacity: 0.3 } : {})
        }}
        viewBox="0 0 200 180"
        fill="none"
    >
        {/* Main tower */}
        <rect x="60" y="20" width="80" height="160" rx="3" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
        {/* Windows grid */}
        {[35, 55, 75, 95, 115, 135, 155].map(y =>
            [75, 95, 115].map(x => (
                <rect key={`${x}-${y}`} x={x} y={y} width="10" height="8" rx="1" fill="#3B82F6" opacity={isPulsing ? 0.5 : 0.25} style={{ transition: 'opacity 0.5s' }} />
            ))
        )}
        {/* Left wing */}
        <rect x="20" y="70" width="40" height="110" rx="2" stroke="#3B82F6" strokeWidth="1" fill="none" />
        {[85, 105, 125, 145, 160].map(y =>
            [30, 45].map(x => (
                <rect key={`L${x}-${y}`} x={x} y={y} width="8" height="6" rx="1" fill="#3B82F6" opacity={isPulsing ? 0.4 : 0.2} style={{ transition: 'opacity 0.5s' }} />
            ))
        )}
        {/* Right wing */}
        <rect x="140" y="55" width="40" height="125" rx="2" stroke="#3B82F6" strokeWidth="1" fill="none" />
        {[70, 90, 110, 130, 150, 165].map(y =>
            [150, 165].map(x => (
                <rect key={`R${x}-${y}`} x={x} y={y} width="8" height="6" rx="1" fill="#3B82F6" opacity={isPulsing ? 0.4 : 0.2} style={{ transition: 'opacity 0.5s' }} />
            ))
        )}
        {/* Door */}
        <rect x="90" y="162" width="20" height="18" rx="2" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
        {/* Roof antenna */}
        <line x1="100" y1="20" x2="100" y2="5" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="100" cy="4" r="2" fill={isPulsing ? '#3B82F6' : '#3B82F6'} opacity={isPulsing ? 0.9 : 0.4} style={{ transition: 'opacity 0.5s' }}>
            {isPulsing && <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />}
        </circle>
    </svg>
);

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loadingModule, setLoadingModule] = useState(false);
    const [isHoveringCards, setIsHoveringCards] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    const toggleTheme = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    };
    
    // Typewriter state
    const [typewriterLineIndex, setTypewriterLineIndex] = useState(0);
    const [typewriterText, setTypewriterText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const currentLine = TYPEWRITER_LINES[typewriterLineIndex];
        
        if (!isDeleting) {
            // Typing forward
            if (typewriterText.length < currentLine.length) {
                typewriterRef.current = setTimeout(() => {
                    setTypewriterText(currentLine.substring(0, typewriterText.length + 1));
                }, 50);
            } else {
                // Finished typing, pause then start deleting
                typewriterRef.current = setTimeout(() => setIsDeleting(true), 7000);
            }
        } else {
            // Deleting
            if (typewriterText.length > 0) {
                typewriterRef.current = setTimeout(() => {
                    setTypewriterText(typewriterText.substring(0, typewriterText.length - 1));
                }, 25);
            } else {
                // Finished deleting, move to next line
                setIsDeleting(false);
                setTypewriterLineIndex((prev) => (prev + 1) % TYPEWRITER_LINES.length);
            }
        }

        return () => { if (typewriterRef.current) clearTimeout(typewriterRef.current); };
    }, [typewriterText, isDeleting, typewriterLineIndex]);

    // Leaderboard State
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loadingLeaders, setLoadingLeaders] = useState(true);

    const startModule = (id: string) => {
        setLoadingModule(true);
        setTimeout(() => {
            navigate(`/game/${id}`);
        }, 1500);
    };

    const handleOpenLeaderboard = async () => {
        setShowLeaderboard(true);
        setLoadingLeaders(true);
        const data = await getTopStaffMembers();
        setLeaders(data);
        setLoadingLeaders(false);
    };

    const getIconForType = (type: string) => {
        switch(type) {
            case 'fire': return Flame;
            case 'medical': return Cross;
            case 'guest': return Activity;
            case 'danger': return ShieldAlert;
            case 'cyber': return Activity;
            case 'general':
            default: return LayoutGrid;
        }
    };

    const getRingColor = (type: string) => {
        switch(type) {
            case 'fire': return '';
            case 'medical': return 'green';
            case 'guest': return 'purple';
            case 'danger': return 'red';
            case 'cyber': return 'blue';
            case 'general':
            default: return 'blue';
        }
    };

    // ======== LAYOUT 1: Compact Horizontal Scroll (smaller cards) ========
    const renderLayout1 = () => (
        <div className="horizontal-scroll">
            {MODULES.map((module, index) => {
                const Icon = getIconForType(module.type);
                const ringColor = getRingColor(module.type);
                return (
                    <div key={module.id} className="module-card fade-in" style={{ 
                        '--delay': `${0.1 + (index * 0.1)}s`, 
                        backgroundImage: `linear-gradient(to top, var(--card-gradient), transparent), url('${module.imgUrl}')`,
                        minWidth: '220px',
                        height: '340px',
                        padding: '1.25rem'
                    } as React.CSSProperties}>
                        <div className="card-content">
                            <div className={`icon-ring ${ringColor}`} style={{ width: '36px', height: '36px', marginBottom: '0.6rem' }}><Icon size={16} /></div>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>{module.title}</h2>
                            <p style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', marginBottom: '0.3rem', fontSize: '0.65rem' }}>ID: {module.id}</p>
                            <p style={{ fontSize: '0.8rem', lineHeight: 1.3, marginBottom: '0.8rem', color: 'var(--card-text)' }}>{module.desc}</p>
                            <button onClick={() => startModule(module.id)} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Launch Protocol</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // ======== LAYOUT 2: 3x2 Grid (compact tiles) ========
    const renderLayout2 = () => (
        <div 
            className="module-grid"
            onMouseEnter={() => setIsHoveringCards(true)}
            onMouseLeave={() => setIsHoveringCards(false)}
        >
            {MODULES.map((module, index) => {
                const Icon = getIconForType(module.type);
                const ringColor = getRingColor(module.type);
                return (
                    <div key={module.id} className="module-card fade-in" style={{ 
                        '--delay': `${0.1 + (index * 0.08)}s`,
                        backgroundImage: `linear-gradient(to top, var(--card-gradient) 5%, transparent 50%), url('${module.imgUrl}')`,
                        minWidth: 'unset',
                        width: '100%',
                        height: '280px',
                        padding: '0.75rem 1rem'
                    } as React.CSSProperties}>
                        <div className="card-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                <div className={`icon-ring ${ringColor}`} style={{ width: '24px', height: '24px', minWidth: '24px' }}><Icon size={12} /></div>
                                <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '0.5rem', letterSpacing: '1px' }}>{module.id}</span>
                            </div>
                            <h2 style={{ fontSize: '0.85rem', marginBottom: '0.1rem', color: 'var(--text-main)' }}>{module.title}</h2>
                            <p style={{ fontSize: '0.65rem', lineHeight: 1.2, marginBottom: '0.5rem', color: 'var(--card-text)' }}>{module.desc}</p>
                            <button onClick={() => startModule(module.id)} style={{ padding: '0.35rem', fontSize: '0.7rem' }}>Launch Protocol</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // ======== LAYOUT 3: Netflix-style Mini Tiles (horizontal scroll, very compact) ========
    const renderLayout3 = () => (
        <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            overflowX: 'auto', 
            paddingBottom: '1rem',
            scrollbarWidth: 'none' as const
        }}>
            {MODULES.map((module, index) => {
                const Icon = getIconForType(module.type);
                const ringColor = getRingColor(module.type);
                return (
                    <div key={module.id} className="fade-in" style={{ 
                        '--delay': `${0.1 + (index * 0.08)}s`,
                        minWidth: '170px',
                        maxWidth: '170px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        flexShrink: 0
                    } as React.CSSProperties}
                    onClick={() => startModule(module.id)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.06) translateY(-8px)';
                        e.currentTarget.style.borderColor = 'rgba(255,51,68,0.4)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                        {/* Image thumbnail */}
                        <div style={{ 
                            height: '110px', 
                            backgroundImage: `url('${module.imgUrl}')`, 
                            backgroundSize: 'cover', 
                            position: 'relative'
                        }}>
                            <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 1 }}>
                                <div className={`icon-ring ${ringColor}`} style={{ width: '26px', height: '26px', minWidth: '26px' }}><Icon size={12} /></div>
                            </div>
                            <img src={module.imgUrl} alt={module.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, var(--sidebar-bg), transparent)' }} />
                        </div>
                        {/* Info */}
                        <div style={{ padding: '0.7rem 0.8rem', background: 'var(--sidebar-bg)' }}>
                            <p style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '0.55rem', letterSpacing: '1px', marginBottom: '0.2rem' }}>{module.id}</p>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{module.title}</h4>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{module.desc}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="layout-wrapper">
            <nav className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
                <div className="sidebar-top">
                    <div className="pulse-brand">
                        <Activity className="pulse-logo" size={28} color="var(--accent-primary)" />
                        <h2>PULSE</h2>
                    </div>
                </div>
                
                <div className="sidebar-center">
                    <div className="sidebar-item active">
                        <LayoutGrid size={20} />
                        {isSidebarOpen && <span>Training Modules</span>}
                    </div>
                    <div className="sidebar-item">
                        <Award size={20} />
                        {isSidebarOpen && <span>Certifications</span>}
                    </div>
                    <div className="sidebar-item" onClick={handleOpenLeaderboard}>
                        <LineChart size={20} />
                        {isSidebarOpen && <span>Leaderboard</span>}
                    </div>
                    <div className="sidebar-item" onClick={logout} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Log Out</span>}
                    </div>
                    <button className="theme-toggle" onClick={toggleTheme} style={{ marginTop: '0.5rem' }}>
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        {isSidebarOpen && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                </div>

                {isSidebarOpen && (
                    <div className="sidebar-bottom">
                        <div className="safety-score-mini">
                            <span className="score-label">Logged In As</span>
                            <span className="score-number" style={{ fontSize: '0.8rem', color: '#FFF' }}>{user?.email}</span>
                        </div>
                        <div className="user-avatar" title={user?.email || "User"}>
                            <img src="https://i.pravatar.cc/100?img=12" alt="User" />
                        </div>
                    </div>
                )}
            </nav>

            <main className="main-carousel">

                {/* ===== COMMAND CENTER HUD HEADER ===== */}
                <header style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--hud-bg)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap' as const,
                    gap: '0.75rem',
                    minHeight: '80px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                    transition: 'background 0.4s, border-color 0.4s'
                }}>
                    {/* Animated EKG background */}
                    <EKGWaveform />

                    {/* Hotel building silhouette */}
                    <HotelSilhouette isPulsing={isHoveringCards} />

                    {/* Left content */}
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {/* Status bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E, 0 0 4px #22C55E' }} />
                            <span style={{ fontSize: '0.6rem', color: '#22C55E', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>ONLINE</span>
                            <div style={{ width: '1px', height: '10px', background: 'var(--border-subtle)', margin: '0 0.3rem' }} />
                            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {/* Typewriter line */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '0.6rem', fontWeight: 700 }}>▶</span>
                            <h2 style={{
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                fontFamily: 'monospace',
                                letterSpacing: '1.5px',
                                lineHeight: 1.2,
                                minHeight: '1.3rem'
                            }}>
                                {typewriterText}
                                <span style={{ 
                                    display: 'inline-block',
                                    width: '2px', 
                                    height: '1rem', 
                                    background: 'var(--accent-primary)', 
                                    marginLeft: '2px',
                                    verticalAlign: 'text-bottom',
                                    animation: 'blink 1s step-end infinite'
                                }} />
                            </h2>
                        </div>

                        {/* Subtitle */}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                            Pick a crisis module below to begin your drill.
                        </p>
                    </div>

                    {/* Right: Quick Start button */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <button className="resume-btn" onClick={() => startModule('K-01')} style={{ fontSize: '0.8rem', padding: '0.65rem 1.4rem' }}>
                            <Play size={14} /> Quick Start
                        </button>
                    </div>
                </header>

                {/* Blinking cursor keyframe (injected inline) */}
                <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>

                {/* ===== ACTIVE LAYOUT RENDER ===== */}
                {(ACTIVE_LAYOUT as number) === 1 && renderLayout1()}
                {(ACTIVE_LAYOUT as number) === 2 && renderLayout2()}
                {(ACTIVE_LAYOUT as number) === 3 && renderLayout3()}

            </main>

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div className="overlay">
                    <div className="overlay-box" style={{ background: '#12151B', padding: '2rem', borderRadius: '16px', border: '1px solid #FF3344', width: '400px', textAlign: 'left', position: 'relative' }}>
                        <X size={24} style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: '#8E9BAE' }} onClick={() => setShowLeaderboard(false)} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: '#FF3344' }}>
                            <Trophy size={28} />
                            <h2 style={{ color: '#FFF' }}>Top Performers</h2>
                        </div>
                        
                        {loadingLeaders ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}><Loader className="spinner" size={32} /></div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {leaders.map((lead, i) => (
                                    <li key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: i === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent' }}>
                                        <span style={{ fontWeight: 600, color: i === 0 ? '#FFD700' : '#FFF' }}>{i + 1}. {lead.displayName}</span>
                                        <span style={{ color: '#22C55E', fontWeight: 800 }}>{lead.total_score} pts</span>
                                    </li>
                                ))}
                                {leaders.length === 0 && <p style={{ color: '#8E9BAE' }}>No data available yet.</p>}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {loadingModule && (
                <div id="loading-overlay" className="overlay">
                    <div className="overlay-box">
                        <Loader className="spinner" size={40} />
                        <h2>Loading Module...</h2>
                        <p>Initializing Game Environment...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
