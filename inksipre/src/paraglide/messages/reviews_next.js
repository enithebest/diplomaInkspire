/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_reviews_next = /** @type {(inputs: {}) => string} */ () => {
	return `Next reviews`
};

const de_reviews_next = /** @type {(inputs: {}) => string} */ () => {
	return `NÃ¤chste Bewertungen`
};

const it_reviews_next = /** @type {(inputs: {}) => string} */ () => {
	return `Recensioni successive`
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
export const reviews_next = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.reviews_next(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("reviews_next", locale)
	if (locale === "en") return en_reviews_next(inputs)
	if (locale === "de") return de_reviews_next(inputs)
	return it_reviews_next(inputs)
};