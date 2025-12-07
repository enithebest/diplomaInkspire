/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_nav_greeting = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Welcome, ${i.name}`
};

const de_nav_greeting = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Willkommen, ${i.name}`
};

const it_nav_greeting = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Benvenuto/a, ${i.name}`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ name: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "de" | "it" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const nav_greeting = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_greeting(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_greeting", locale)
	if (locale === "en") return en_nav_greeting(inputs)
	if (locale === "de") return de_nav_greeting(inputs)
	return it_nav_greeting(inputs)
};