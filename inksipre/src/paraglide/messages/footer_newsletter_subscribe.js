/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_footer_newsletter_subscribe = /** @type {(inputs: {}) => string} */ () => {
	return `Subscribe`
};

const de_footer_newsletter_subscribe = /** @type {(inputs: {}) => string} */ () => {
	return `Abonnieren`
};

const it_footer_newsletter_subscribe = /** @type {(inputs: {}) => string} */ () => {
	return `Iscriviti`
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
export const footer_newsletter_subscribe = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.footer_newsletter_subscribe(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("footer_newsletter_subscribe", locale)
	if (locale === "en") return en_footer_newsletter_subscribe(inputs)
	if (locale === "de") return de_footer_newsletter_subscribe(inputs)
	return it_footer_newsletter_subscribe(inputs)
};