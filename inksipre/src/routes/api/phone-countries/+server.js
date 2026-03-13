import { json } from '@sveltejs/kit';
import { getPhoneCountries } from '$lib/data/phoneCountries.js';

export async function GET({ fetch }) {
	return json(await getPhoneCountries(fetch));
}
