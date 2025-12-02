/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_footer_terms = /** @type {(inputs: {}) => string} */ () => {
	return `Terms`
};

const de_footer_terms = /** @type {(inputs: {}) => string} */ () => {
	return `Nutzungsbedingungen`
};

const it_footer_terms = /** @type {(inputs: {}) => string} */ () => {
	return `Termini`
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
export const footer_terms = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.footer_terms(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("footer_terms", locale)
	if (locale === "en") return en_footer_terms(inputs)
	if (locale === "de") return de_footer_terms(inputs)
	return it_footer_terms(inputs)
};