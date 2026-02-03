import React, { useEffect, useState } from 'react';
import type { BacklogEntry, GameStatus } from '../types/game';
import { BacklogService } from '../services/BacklogService';
import GameCard from '../components/GameCard';

const Backlog: React.FC = () => {
    const [entries, setEntries] = useState<BacklogEntry[]>([]);
    const [activeFilter, setActiveFilter] = useState<GameStatus | 'all'>('all');
    const [genreFilter, setGenreFilter] = useState<string>('all');
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('added-desc');
    const [showMissingHltb, setShowMissingHltb] = useState(false);

    const refreshBacklog = () => {
        setEntries(BacklogService.getBacklog());
    };

    useEffect(() => {
        refreshBacklog();
        window.addEventListener('backlog-updated', refreshBacklog);
        return () => window.removeEventListener('backlog-updated', refreshBacklog);
    }, []);

    const allGenres = Array.from(new Set(entries.flatMap(e => e.game.genres.map(g => g.name)))).sort();
    const allPlatforms = Array.from(new Set(entries.flatMap(e => e.game.platforms.map(p => p.platform.name)))).sort();

    const filteredEntries = entries.filter(e => {
        const matchesStatus = activeFilter === 'all' || e.status === activeFilter;
        const matchesGenre = genreFilter === 'all' || e.game.genres.some(g => g.name === genreFilter);
        const matchesPlatform = platformFilter === 'all' || e.game.platforms.some(p => p.platform.name === platformFilter);
        const matchesAudit = !showMissingHltb || (!e.hltb_main || e.hltb_main === 0);
        return matchesStatus && matchesGenre && matchesPlatform && matchesAudit;
    });

    const sortedEntries = [...filteredEntries].sort((a, b) => {
        switch (sortBy) {
            case 'name-asc': return a.game.name.localeCompare(b.game.name);
            case 'metacritic-desc': return (b.game.metacritic || 0) - (a.game.metacritic || 0);
            case 'hltb-asc': {
                const aTime = a.hltb_main || 9999;
                const bTime = b.hltb_main || 9999;
                return aTime - bTime;
            }
            case 'hltb-desc': {
                const aTime = a.hltb_main || 0;
                const bTime = b.hltb_main || 0;
                return bTime - aTime;
            }
            case 'added-desc':
            default:
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        }
    });

    const stats = BacklogService.getStats();

    const filterTabs: { id: GameStatus | 'all', label: string }[] = [
        { id: 'all', label: 'Todos' },
        { id: 'playing', label: 'Jugando' },
        { id: 'want-to-play', label: 'Por jugar' },
        { id: 'beaten', label: 'Terminados' },
        { id: 'completed', label: 'Completados' },
        { id: 'shelved', label: 'En pausa' },
        { id: 'abandoned', label: 'Abandonados' }
    ];

    return (
        <main className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>Mi Biblioteca</h2>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button
                            onClick={() => setShowMissingHltb(!showMissingHltb)}
                            className="btn"
                            style={{
                                background: showMissingHltb ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: showMissingHltb ? '#ef4444' : 'var(--text-main)',
                                border: `1px solid ${showMissingHltb ? '#ef4444' : 'var(--glass-border)'}`,
                                fontSize: '0.85rem',
                                padding: '0.5rem 1rem'
                            }}
                        >
                            {showMissingHltb ? '🚫 Detener Auditoría' : '🔍 Auditoría Duraciones (Sin Horas)'}
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jugando</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.playing}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Completados</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>{stats.completed + stats.beaten}</div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                    scrollbarWidth: 'none'
                }}>
                    {filterTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`btn ${activeFilter === tab.id ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flexShrink: 0, padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    background: 'var(--bg-accent)',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.05rem' }}>GÉNERO</label>
                        <select
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                            className="glass"
                            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', color: 'white', fontSize: '0.85rem', minWidth: '150px' }}
                        >
                            <option value="all">Todos los géneros</option>
                            {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.05rem' }}>PLATAFORMA</label>
                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="glass"
                            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', color: 'white', fontSize: '0.85rem', minWidth: '150px' }}
                        >
                            <option value="all">Todas las plataformas</option>
                            {allPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginLeft: 'auto' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.05rem' }}>ORDENAR POR</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="glass"
                            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', color: 'white', fontSize: '0.85rem', minWidth: '180px' }}
                        >
                            <option value="added-desc">Añadidos recientemente</option>
                            <option value="name-asc">Nombre (A-Z)</option>
                            <option value="metacritic-desc">Puntuación Metacritic</option>
                            <option value="hltb-asc">Duración HLTB (Menor a mayor)</option>
                            <option value="hltb-desc">Duración HLTB (Mayor a menor)</option>
                        </select>
                    </div>
                </div>
            </header>

            {sortedEntries.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    background: 'var(--bg-accent)',
                    borderRadius: '20px'
                }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>No hay juegos que coincidan con estos filtros</h3>
                    <button
                        onClick={() => {
                            setGenreFilter('all');
                            setPlatformFilter('all');
                            setActiveFilter('all');
                        }}
                        className="btn btn-outline"
                        style={{ marginTop: '1rem' }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {sortedEntries.map(entry => (
                        <GameCard
                            key={entry.game.id}
                            game={entry.game}
                            currentStatus={entry.status}
                            onStatusChange={refreshBacklog}
                            hltbTimes={{ main: entry.hltb_main }}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

export default Backlog;
