
export const load = async ({ locals }) => {
	return {
		user: locals.user || null,
		locale: locals.locale ?? 'en',
		locales: locals.locales ?? ['en']
	};
};
