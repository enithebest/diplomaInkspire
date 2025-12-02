/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_register_here = /** @type {(inputs: {}) => string} */ () => {
	return `Register here`
};

const de_register_here = /** @type {(inputs: {}) => string} */ () => {
	return `Hier registrieren`
};

const it_register_here = /** @type {(inputs: {}) => string} */ () => {
	return `Registrati qui`
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
export const register_here = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.register_here(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("register_here", locale)
	if (locale === "en") return en_register_here(inputs)
	if (locale === "de") return de_register_here(inputs)
	return it_register_here(inputs)
};