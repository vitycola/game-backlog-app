const PLATFORMS_KEY = 'gg_owned_platforms';

export interface Platform {
    id: number;
    name: string;
}

export const SettingsService = {
    getOwnedPlatforms(): number[] {
        const data = localStorage.getItem(PLATFORMS_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveOwnedPlatforms(platformIds: number[]) {
        localStorage.setItem(PLATFORMS_KEY, JSON.stringify(platformIds));
        window.dispatchEvent(new Event('settings-updated'));
    },

    // Common parent platforms from RAWG
    getAvailablePlatforms(): Platform[] {
        return [
            { id: 2, name: 'PlayStation' },
            { id: 3, name: 'Xbox' },
            { id: 7, name: 'Nintendo' },
            { id: 1, name: 'PC' },
            { id: 4, name: 'iOS' },
            { id: 8, name: 'Android' }
        ];
    }
};
