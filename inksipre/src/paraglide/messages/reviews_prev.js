/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_reviews_prev = /** @type {(inputs: {}) => string} */ () => {
	return `Previous reviews`
};

const de_reviews_prev = /** @type {(inputs: {}) => string} */ () => {
	return `Vorherige Bewertungen`
};

const it_reviews_prev = /** @type {(inputs: {}) => string} */ () => {
	return `Recensioni precedenti`
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
export const reviews_prev = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.reviews_prev(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("reviews_prev", locale)
	if (locale === "en") return en_reviews_prev(inputs)
	if (locale === "de") return de_reviews_prev(inputs)
	return it_reviews_prev(inputs)
};