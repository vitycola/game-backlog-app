import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Backlog from './views/Backlog';
import PlatformsModal from './components/PlatformsModal';

function App() {
  const [activeView, setActiveView] = useState<'home' | 'backlog'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (activeView !== 'home') setActiveView('home');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveView('home');
  };

  return (
    <>
      <Navbar
        onSearch={handleSearch}
        onNavigate={setActiveView}
        onClearSearch={handleClearSearch}
        activeView={activeView}
        searchQuery={searchQuery}
      />

      <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginBottom: '1rem' }}>
        <button
          className="btn btn-outline"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}
        >
          🎮 Mis Consolas
        </button>
      </div>

      {activeView === 'home' ? (
        <Home searchQuery={searchQuery} />
      ) : (
        <Backlog />
      )}

      {isModalOpen && (
        <PlatformsModal onClose={() => setIsModalOpen(false)} />
      )}

      <footer style={{
        marginTop: 'auto',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <p>GG.BACKLOG &copy; 2026 - Datos de RAWG.io</p>
      </footer>
    </>
  );
}

export default App;
