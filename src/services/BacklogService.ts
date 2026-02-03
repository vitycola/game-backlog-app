import type { BacklogEntry, Game, GameStatus } from '../types/game';

const STORAGE_KEY = 'gg_backlog_data';

export const BacklogService = {
    getBacklog(): BacklogEntry[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveBacklog(entries: BacklogEntry[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        // Dispatch custom event to notify components
        window.dispatchEvent(new Event('backlog-updated'));
    },

    addToBacklog(game: Game, status: GameStatus = 'want-to-play') {
        const backlog = this.getBacklog();
        const existing = backlog.find(e => e.game.id === game.id);

        if (existing) {
            this.updateStatus(game.id, status);
            return;
        }

        const newEntry: BacklogEntry = {
            game,
            status,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.saveBacklog([...backlog, newEntry]);
    },

    removeFromBacklog(gameId: number) {
        const backlog = this.getBacklog();
        this.saveBacklog(backlog.filter(e => e.game.id !== gameId));
    },

    updateStatus(gameId: number, status: GameStatus) {
        const backlog = this.getBacklog();
        const index = backlog.findIndex(entry => entry.game.id === gameId);
        if (index !== -1) {
            backlog[index].status = status;
            backlog[index].updatedAt = new Date().toISOString();
            this.saveBacklog(backlog);
        }
    },

    updateHLTB(gameId: number, times: { main?: number, extras?: number, complete?: number }) {
        const backlog = this.getBacklog();
        const index = backlog.findIndex(entry => entry.game.id === gameId);
        if (index !== -1) {
            backlog[index] = {
                ...backlog[index],
                hltb_main: times.main,
                hltb_extras: times.extras,
                hltb_complete: times.complete,
                updatedAt: new Date().toISOString()
            };
            this.saveBacklog(backlog);
        }
    },

    getStats() {
        const backlog = this.getBacklog();
        return {
            total: backlog.length,
            playing: backlog.filter(e => e.status === 'playing').length,
            beaten: backlog.filter(e => e.status === 'beaten').length,
            completed: backlog.filter(e => e.status === 'completed').length,
            wantToPlay: backlog.filter(e => e.status === 'want-to-play').length
        };
    }
};
