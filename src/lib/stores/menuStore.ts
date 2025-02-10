import { writable } from 'svelte/store';

export type MenuType = 'home' | 'family-tree' | 'photos' | 'stories' | 'contact' | 'about' | 'anniversaries';

interface MenuItem {
    name: string;
    icon: string;
    path: string;
    requiresAuth?: boolean;
}

interface MenuConfig {
    menuItems: MenuItem[];
}

export const menuName = writable<MenuType>('home');

export const menuConfigs: Record<MenuType, MenuConfig> = {
    'home': {
        menuItems: [
            { name: 'Home', icon: 'home', path: '/' },
            { name: 'Contact', icon: 'contact', path: '/contact' },
            { name: 'About', icon: 'info', path: '/about' }

        ]
    },
    'family-tree': {
        menuItems: [
            { name: 'Home', icon: 'home', path: '/' },
            { name: 'Contact', icon: 'contact', path: '/contact' },
            { name: 'About', icon: 'info', path: '/about' },
            { name: 'Add New', icon: 'add', path: '/admin/person/0', requiresAuth: true },
            { name: 'Search', icon: 'search', path: '/admin/person' },
        ]

    },

    'photos': { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
    'stories': { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
    'anniversaries': { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },    
    'contact': { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
    'about': { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] }
} as const;











