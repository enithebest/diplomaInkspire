import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'inkspire-theme';

const getPreferredTheme = () => {
	if (!browser) return 'dark';

	const savedTheme = window.localStorage.getItem(STORAGE_KEY);
	if (savedTheme === 'light' || savedTheme === 'dark') {
		return savedTheme;
	}

	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const createThemeStore = () => {
	const { subscribe, set, update } = writable('dark');

	const applyTheme = (value) => {
		if (!browser) return;
		document.documentElement.dataset.theme = value;
		window.localStorage.setItem(STORAGE_KEY, value);
	};

	return {
		subscribe,
		init() {
			const nextTheme = getPreferredTheme();
			set(nextTheme);
			applyTheme(nextTheme);
		},
		toggle() {
			update((current) => {
				const nextTheme = current === 'dark' ? 'light' : 'dark';
				applyTheme(nextTheme);
				return nextTheme;
			});
		}
	};
};

export const theme = createThemeStore();
