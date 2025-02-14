import { writable } from 'svelte/store';

export const showPersonFormStore = writable<boolean>(false);
export const showSearchFormStore = writable<boolean>(false);
export const PersonIdStore = writable<string | null>(null);
export const showImageSelectorStore = writable<boolean>(false);
export const showRelationshipFormStore = writable<boolean>(false);
export const personA_Store = writable<string>('');
export const personB_Store = writable<string>('');
export const personC_Store = writable<string>('');
