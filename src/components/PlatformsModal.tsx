import React, { useState } from 'react';
import { SettingsService } from '../services/SettingsService';

interface PlatformsModalProps {
    onClose: () => void;
}

const PlatformsModal: React.FC<PlatformsModalProps> = ({ onClose }) => {
    const available = SettingsService.getAvailablePlatforms();
    const [selectedIds, setSelectedIds] = useState<number[]>(SettingsService.getOwnedPlatforms());

    const togglePlatform = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        SettingsService.saveOwnedPlatforms(selectedIds);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
        }}>
            <div className="glass" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '2rem',
                border: '1px solid var(--primary)'
            }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Mis Consolas</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Selecciona las plataformas que tienes para ver solo juegos compatibles.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2.5rem'
                }}>
                    {available.map(p => {
                        const isSelected = selectedIds.includes(p.id);
                        return (
                            <button
                                key={p.id}
                                onClick={() => togglePlatform(p.id)}
                                className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                                style={{
                                    justifyContent: 'center',
                                    padding: '1rem',
                                    fontSize: '0.9rem',
                                    border: isSelected ? 'none' : '1px solid var(--glass-border)'
                                }}
                            >
                                {p.name}
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleSave}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

export default PlatformsModal;
