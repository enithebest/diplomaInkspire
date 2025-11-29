/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_footer_newsletter_header = /** @type {(inputs: {}) => string} */ () => {
	return `Stay in the loop`
};

const de_footer_newsletter_header = /** @type {(inputs: {}) => string} */ () => {
	return `Bleiben Sie informiert`
};

const it_footer_newsletter_header = /** @type {(inputs: {}) => string} */ () => {
	return `Rimani aggiornato`
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
export const footer_newsletter_header = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.footer_newsletter_header(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("footer_newsletter_header", locale)
	if (locale === "en") return en_footer_newsletter_header(inputs)
	if (locale === "de") return de_footer_newsletter_header(inputs)
	return it_footer_newsletter_header(inputs)
};