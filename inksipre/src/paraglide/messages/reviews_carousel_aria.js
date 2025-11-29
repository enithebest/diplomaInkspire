/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_reviews_carousel_aria = /** @type {(inputs: {}) => string} */ () => {
	return `Customer reviews carousel`
};

const de_reviews_carousel_aria = /** @type {(inputs: {}) => string} */ () => {
	return `Kundenbewertungen Karussell`
};

const it_reviews_carousel_aria = /** @type {(inputs: {}) => string} */ () => {
	return `Carosello recensioni clienti`
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
export const reviews_carousel_aria = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.reviews_carousel_aria(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("reviews_carousel_aria", locale)
	if (locale === "en") return en_reviews_carousel_aria(inputs)
	if (locale === "de") return de_reviews_carousel_aria(inputs)
	return it_reviews_carousel_aria(inputs)
};