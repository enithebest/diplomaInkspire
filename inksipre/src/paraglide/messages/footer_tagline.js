/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_footer_tagline = /** @type {(inputs: {}) => string} */ () => {
	return `Customize quality apparel and merch with fast turnaround and premium prints.`
};

const de_footer_tagline = /** @type {(inputs: {}) => string} */ () => {
	return `Customize quality apparel and merch with fast turnaround and premium prints.`
};

const it_footer_tagline = /** @type {(inputs: {}) => string} */ () => {
	return `Customize quality apparel and merch with fast turnaround and premium prints.`
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
export const footer_tagline = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.footer_tagline(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("footer_tagline", locale)
	if (locale === "en") return en_footer_tagline(inputs)
	if (locale === "de") return de_footer_tagline(inputs)
	return it_footer_tagline(inputs)
};