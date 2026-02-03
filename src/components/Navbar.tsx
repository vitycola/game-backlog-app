import React, { useState, useEffect } from 'react';

interface NavbarProps {
    onSearch: (query: string) => void;
    onNavigate: (view: 'home' | 'backlog') => void;
    onClearSearch: () => void;
    activeView: 'home' | 'backlog';
    searchQuery: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onNavigate, onClearSearch, activeView, searchQuery }) => {
    const [internalQuery, setInternalQuery] = useState(searchQuery);

    // Sync internal state with prop (for clearing search)
    useEffect(() => {
        setInternalQuery(searchQuery);
    }, [searchQuery]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (internalQuery !== searchQuery) {
                onSearch(internalQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [internalQuery, onSearch, searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(internalQuery);
    };

    const handleLogoClick = () => {
        onClearSearch();
        onNavigate('home');
    };

    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: '1rem',
            margin: '1rem 2rem',
            padding: '0.8rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
            gap: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: 'linear-gradient(90deg, #8a2be2, #00f2ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }} onClick={handleLogoClick}>
                    GG.BACKLOG
                </h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn ${activeView === 'home' && !searchQuery ? 'btn-primary' : 'btn-outline'}`}
                        onClick={handleLogoClick}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        Explorar
                    </button>
                    <button
                        className={`btn ${activeView === 'backlog' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => onNavigate('backlog')}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        Mi Backlog
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{
                flexGrow: 1,
                maxWidth: '500px',
                position: 'relative'
            }}>
                <input
                    type="text"
                    placeholder="Buscar juegos..."
                    value={internalQuery}
                    onChange={(e) => setInternalQuery(e.target.value)}
                    className="glass"
                    style={{
                        width: '100%',
                        padding: '0.8rem 1.2rem',
                        paddingRight: '3rem',
                        border: 'none',
                        color: 'white',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none'
                }}>
                    🔍
                </div>
            </form>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px var(--primary-glow)'
                }}>
                    V
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
