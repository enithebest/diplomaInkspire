import { json } from '@sveltejs/kit';

const LOOKUP_ENDPOINT = 'https://nominatim.openstreetmap.org/search';

export const GET = async ({ url }) => {
	const city = (url.searchParams.get('city') || '').trim();

	if (!city) {
		return json({ error: 'city required' }, { status: 400 });
	}

	const lookupUrl = new URL(LOOKUP_ENDPOINT);
	lookupUrl.searchParams.set('q', city);
	lookupUrl.searchParams.set('format', 'json');
	lookupUrl.searchParams.set('addressdetails', '1');
	lookupUrl.searchParams.set('limit', '1');

	try {
		const res = await fetch(lookupUrl, {
			headers: {
				'User-Agent': 'InkspireCheckout/1.0 (support@inkspire.local)'
			}
		});

		if (!res.ok) {
			return json({ error: 'lookup failed' }, { status: 502 });
		}

		const payload = await res.json().catch(() => null);
		const address = payload?.[0]?.address;
		const countryCode = address?.country_code?.toUpperCase() || '';
		const countryName = address?.country || '';

		if (!countryCode) {
			return json({ error: 'not found' }, { status: 404 });
		}

		return json({ countryCode, countryName });
	} catch (err) {
		console.error('City lookup error', err);
		return json({ error: 'lookup error' }, { status: 500 });
	}
};
