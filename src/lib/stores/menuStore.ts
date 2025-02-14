import { writable } from 'svelte/store';

export type MenuType =
	| 'home'
	| 'family-tree'
	| 'photos'
	| 'stories'
	| 'resume'
	| 'contact'
	| 'about'
	| 'anniversaries';

interface MenuItem {
	name: string;
	icon: string;
	path: string;
	requiresAuth?: boolean;
}

interface MenuConfig {
	menuItems: MenuItem[];
}

export const menuRequired = writable<boolean>(false);
export const menuName = writable<MenuType>('home');

export const menuConfigs: Record<MenuType, MenuConfig> = {
	home: {
		menuItems: [
			{ name: 'Home', icon: 'home', path: '/' },
			{ name: 'blank01', icon: 'blank', path: '/' },
			{ name: 'blank02', icon: 'blank', path: '/' },
			{ name: 'Contact', icon: 'contact', path: '/contact' },
			{ name: 'About', icon: 'info', path: '/about' }
		]
	},
	'family-tree': {
		menuItems: [
			{ name: 'Home', icon: 'home', path: '/' },
			{ name: 'New Person', icon: 'add-new', path: '/admin/person/0', requiresAuth: true },
			{ name: 'Search', icon: 'search', path: '/admin/person' },
			{ name: 'Contact', icon: 'contact', path: '/contact' },
			{ name: 'About', icon: 'info', path: '/about' }
		]
	},

	photos: { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
	stories: { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
	resume: {
		menuItems: [
			{ name: 'Home', icon: 'home', path: '/' },
			{ name: 'blank01', icon: 'blank', path: '/' },
			{ name: 'blank02', icon: 'blank', path: '/' },
			{ name: 'blank03', icon: 'blank', path: '/' },
			{ name: 'blank04', icon: 'blank', path: '/' }
		]
	},
	anniversaries: { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
	contact: { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] },
	about: { menuItems: [{ name: 'Home', icon: 'home', path: '/' }] }
} as const;
