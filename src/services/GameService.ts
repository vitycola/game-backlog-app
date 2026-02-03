import type { RAWGResponse } from '../types/game';
import { MOCK_GAMES } from './MockData';
import { SettingsService } from './SettingsService';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY || '';
const BASE_URL = 'https://api.rawg.io/api';

const isMockMode = !API_KEY || API_KEY === 'YOUR_API_KEY';

export type DiscoveryCategory = 'trending' | 'best_2024' | 'best_2025' | 'upcoming' | 'top_rpgs' | 'top_action';

export const GameService = {
    getPlatformFilter(): string {
        const platforms = SettingsService.getOwnedPlatforms();
        return platforms.length > 0 ? `&parent_platforms=${platforms.join(',')}` : '';
    },

    async getTrendingGames(page = 1): Promise<RAWGResponse> {
        if (isMockMode) {
            return { results: MOCK_GAMES, next: null, previous: null, count: MOCK_GAMES.length };
        }

        const response = await fetch(
            `${BASE_URL}/games?key=${API_KEY}&page=${page}&ordering=-relevance&page_size=20${this.getPlatformFilter()}`
        );
        if (!response.ok) throw new Error('API Error');
        return response.json();
    },

    async getDiscoveryGames(category: DiscoveryCategory, page = 1, genreId?: number): Promise<RAWGResponse> {
        if (isMockMode) return this.getTrendingGames(page);

        let params = '';
        const currentYear = new Date().getFullYear();

        switch (category) {
            case 'trending':
                params = '&ordering=-relevance';
                break;
            case 'best_2024':
                params = '&dates=2024-01-01,2024-12-31&ordering=-metacritic';
                break;
            case 'best_2025':
                params = '&dates=2025-01-01,2025-12-31&ordering=-metacritic';
                break;
            case 'upcoming':
                const nextYear = currentYear + 1;
                params = `&dates=${currentYear}-01-31,${nextYear}-12-31&ordering=released`;
                break;
            case 'top_rpgs':
                params = '&genres=5&ordering=-metacritic';
                break;
            case 'top_action':
                params = '&genres=4&ordering=-metacritic';
                break;
        }

        if (genreId) {
            params += `&genres=${genreId}`;
        }

        const response = await fetch(
            `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=20${params}${this.getPlatformFilter()}`
        );
        if (!response.ok) throw new Error('API Error');
        return response.json();
    },

    async searchGames(query: string, page = 1): Promise<RAWGResponse> {
        if (isMockMode || !query) {
            const filtered = MOCK_GAMES.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
            return { results: filtered, next: null, previous: null, count: filtered.length };
        }

        const response = await fetch(
            `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=20${this.getPlatformFilter()}`
        );
        if (!response.ok) throw new Error('API Error');
        return response.json();
    },

    async getGameDetails(id: number) {
        if (isMockMode) return MOCK_GAMES.find(g => g.id === id) || MOCK_GAMES[0];
        const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch game details');
        return response.json();
    }
};
