import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;

// Provide a noop transport export to satisfy client import expectations.
export const transport = undefined;
