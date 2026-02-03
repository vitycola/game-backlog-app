import React, { useEffect, useState } from 'react';
import type { Game } from '../types/game';
import { GameService } from '../services/GameService';
import type { DiscoveryCategory } from '../services/GameService';
import { BacklogService } from '../services/BacklogService';
import { SettingsService } from '../services/SettingsService';
import GameCard from '../components/GameCard';

interface HomeProps {
    searchQuery: string;
}

const Home: React.FC<HomeProps> = ({ searchQuery }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [backlogData, setBacklogData] = useState<Record<number, { status: string, hltb?: any }>>({});
    const [activeCategory, setActiveCategory] = useState<DiscoveryCategory>('trending');
    const [ownedPlatforms, setOwnedPlatforms] = useState<number[]>(SettingsService.getOwnedPlatforms());

    const refreshBacklog = () => {
        const backlog = BacklogService.getBacklog();
        const data: Record<number, { status: string, hltb?: any }> = {};
        backlog.forEach(entry => {
            data[entry.game.id] = {
                status: entry.status,
                hltb: { main: entry.hltb_main, extras: entry.hltb_extras, complete: entry.hltb_complete }
            };
        });
        setBacklogData(data);
    };

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = searchQuery
                ? await GameService.searchGames(searchQuery)
                : await GameService.getDiscoveryGames(activeCategory);
            setGames(data.results);
        } catch (err) {
            setError('Error al cargar juegos. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [searchQuery, activeCategory, ownedPlatforms]);

    useEffect(() => {
        refreshBacklog();
        const handleSettings = () => setOwnedPlatforms(SettingsService.getOwnedPlatforms());
        window.addEventListener('backlog-updated', refreshBacklog);
        window.addEventListener('settings-updated', handleSettings);
        return () => {
            window.removeEventListener('backlog-updated', refreshBacklog);
            window.removeEventListener('settings-updated', handleSettings);
        };
    }, []);

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="section-title">Cargando...</div>
        </div>
    );

    if (error) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--accent)' }}>
            {error}
        </div>
    );

    const categories: { id: DiscoveryCategory, label: string }[] = [
        { id: 'trending', label: 'Tendencias' },
        { id: 'top_rpgs', label: 'Los 25 Mejores RPGs' },
        { id: 'top_action', label: 'Imprescindibles Acción' },
        { id: 'best_2024', label: 'Mejores 2024' },
        { id: 'best_2025', label: 'Novedades 2025' },
        { id: 'upcoming', label: 'Próximamente' }
    ];

    return (
        <main className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                {!searchQuery && (
                    <div style={{
                        display: 'flex',
                        gap: '0.8rem',
                        marginBottom: '2rem',
                        overflowX: 'auto',
                        paddingBottom: '1rem',
                        scrollbarWidth: 'none'
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                                style={{
                                    flexShrink: 0,
                                    padding: '0.6rem 1.4rem',
                                    fontSize: '0.95rem',
                                    borderRadius: '14px'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                )}

                <h2 className="section-title">
                    {searchQuery ? `Resultados para: ${searchQuery}` : categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {searchQuery
                            ? `Encontramos ${games.length} juegos`
                            : activeCategory.includes('top_')
                                ? 'Basado en las mejores críticas de la historia'
                                : 'Descubre nuevos títulos para tu colección'}
                    </p>
                    {ownedPlatforms.length > 0 && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>● Filtrando por tus consolas</span>
                        </div>
                    )}
                </div>
            </header>

            {games.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    background: 'var(--bg-accent)',
                    borderRadius: '20px',
                    gridColumn: '1 / -1'
                }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>No se encontraron juegos</h3>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Intenta cambiar los filtros o el término de búsqueda.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {games.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                            currentStatus={backlogData[game.id]?.status as any}
                            hltbTimes={backlogData[game.id]?.hltb}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

export default Home;
