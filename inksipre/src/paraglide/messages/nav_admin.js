/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_nav_admin = /** @type {(inputs: {}) => string} */ () => {
	return `Admin`
};

const de_nav_admin = /** @type {(inputs: {}) => string} */ () => {
	return `Admin`
};

const it_nav_admin = /** @type {(inputs: {}) => string} */ () => {
	return `Admin`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{}} inputs
* @param {{ locale?: "en" | "de" | "it" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const nav_admin = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_admin(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_admin", locale)
	if (locale === "en") return en_nav_admin(inputs)
	if (locale === "de") return de_nav_admin(inputs)
	return it_nav_admin(inputs)
};