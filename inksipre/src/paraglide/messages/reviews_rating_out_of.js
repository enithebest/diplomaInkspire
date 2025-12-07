/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_reviews_rating_out_of = /** @type {(inputs: { rating: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.rating} out of 5 stars`
};

const de_reviews_rating_out_of = /** @type {(inputs: { rating: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.rating} von 5 Sternen`
};

const it_reviews_rating_out_of = /** @type {(inputs: { rating: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.rating} su 5 stelle`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ rating: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "de" | "it" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const reviews_rating_out_of = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.reviews_rating_out_of(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("reviews_rating_out_of", locale)
	if (locale === "en") return en_reviews_rating_out_of(inputs)
	if (locale === "de") return de_reviews_rating_out_of(inputs)
	return it_reviews_rating_out_of(inputs)
};