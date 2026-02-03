import React from 'react';
import type { Game, GameStatus } from '../types/game';
import { BacklogService } from '../services/BacklogService';

interface GameCardProps {
    game: Game;
    currentStatus?: GameStatus;
    onStatusChange?: () => void;
    hltbTimes?: { main?: number, extras?: number, complete?: number };
}

const GameCard: React.FC<GameCardProps> = ({ game, currentStatus, onStatusChange, hltbTimes }) => {
    const handleStatusChange = (status: GameStatus) => {
        BacklogService.addToBacklog(game, status);
        if (onStatusChange) onStatusChange();
    };

    const statusLabels: Record<GameStatus, string> = {
        'want-to-play': 'Por jugar',
        'playing': 'Jugando',
        'beaten': 'Terminado',
        'completed': 'Completado',
        'shelved': 'En pausa',
        'abandoned': 'Abandonado'
    };

    return (
        <div className="glass-card" style={{
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                height: '220px',
                width: '100%',
                position: 'relative',
                background: `url(${game.background_image}) center/cover no-repeat`,
                borderRadius: '20px 20px 0 0'
            }}>
                {currentStatus && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const main = prompt('Introduce las horas de "Main Story" de HowLongToBeat:', hltbTimes?.main?.toString() || '');
                            if (main !== null) {
                                BacklogService.updateHLTB(game.id, { main: parseFloat(main) });
                                if (onStatusChange) onStatusChange();
                            }
                        }}
                        className="glass"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backdropFilter: 'blur(10px)',
                            zIndex: 10
                        }}
                    >
                        <span>✏️</span> {hltbTimes?.main ? 'Editar HLTB' : 'Añadir HLTB'}
                    </button>
                )}

                {game.metacritic && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'var(--bg-accent)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#4ade80',
                        border: '1px solid #4ade80'
                    }}>
                        {game.metacritic}
                    </div>
                )}
            </div>

            <div style={{ padding: '1.2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', minHeight: '3.6rem' }}>
                    {game.name}
                </h3>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {game.genres.slice(0, 2).map(g => (
                            <span key={g.name} style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--glass-border)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px'
                            }}>
                                {g.name}
                            </span>
                        ))}
                    </div>

                    {hltbTimes?.main ? (
                        <div
                            title="Tiempo Verificado por ti"
                            style={{
                                fontSize: '0.75rem',
                                color: '#4ade80',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: 'rgba(74, 222, 128, 0.1)',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(74, 222, 128, 0.2)'
                            }}
                        >
                            <span>✅</span> {hltbTimes.main}h
                        </div>
                    ) : game.playtime && game.playtime > 0 ? (
                        <div
                            title="Tiempo promedio estimado (RAWG)"
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: 'rgba(56, 189, 248, 0.1)',
                                padding: '0.1rem 0.5rem',
                                borderRadius: '12px'
                            }}
                        >
                            <span>🕒</span> {game.playtime}h
                        </div>
                    ) : null}

                    <a
                        href={`https://howlongtobeat.com/?q=${encodeURIComponent(game.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver en HowLongToBeat"
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--glass-border)',
                            marginLeft: 'auto'
                        }}
                    >
                        HLTB ↗
                    </a>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    {currentStatus ? (
                        <div style={{ width: '100%' }}>
                            <div style={{
                                fontSize: '0.8rem',
                                color: 'var(--secondary)',
                                marginBottom: '0.4rem',
                                fontWeight: '600'
                            }}>
                                Estado: {statusLabels[currentStatus]}
                            </div>
                            <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(e.target.value as GameStatus)}
                                className="glass"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                {Object.entries(statusLabels).map(([val, label]) => (
                                    <option key={val} value={val} style={{ backgroundColor: 'var(--bg-accent)' }}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <button
                            className="btn btn-outline"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => handleStatusChange('want-to-play')}
                        >
                            + Añadir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameCard;
