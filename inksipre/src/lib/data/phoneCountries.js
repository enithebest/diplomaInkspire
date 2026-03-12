import { phoneCountryFallback } from '$lib/data/phoneCountryFallback.js';

export async function getPhoneCountries(fetchFn) {
	try {
		const response = await fetchFn('https://restcountries.com/v3.1/all?fields=name,idd,cca2');

		if (!response.ok) {
			throw new Error(`REST Countries returned ${response.status}`);
		}

		const payload = await response.json();
		const countries = payload
			.flatMap((country) => {
				const root = country?.idd?.root;
				const suffixes = country?.idd?.suffixes || [];
				const label = country?.name?.common;
				const iso2 = (country?.cca2 || '').toUpperCase();

				if (!root || !suffixes.length || !label || !iso2) return [];

				return suffixes.map((suffix) => ({
					code: `${root}${suffix}`,
					country: label,
					iso2
				}));
			})
			.filter((entry) => /^\+\d+$/.test(entry.code))
			.sort((a, b) => a.country.localeCompare(b.country) || a.code.localeCompare(b.code));

		return { countries: countries.length ? countries : phoneCountryFallback, fallback: false };
	} catch (error) {
		console.error('Failed to fetch phone countries:', error);
		return { countries: phoneCountryFallback, fallback: true };
	}
}
