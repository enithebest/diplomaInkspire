/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_nav_cart = /** @type {(inputs: {}) => string} */ () => {
	return `Cart`
};

const de_nav_cart = /** @type {(inputs: {}) => string} */ () => {
	return `Warenkorb`
};

const it_nav_cart = /** @type {(inputs: {}) => string} */ () => {
	return `Carrello`
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
export const nav_cart = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_cart(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_cart", locale)
	if (locale === "en") return en_nav_cart(inputs)
	if (locale === "de") return de_nav_cart(inputs)
	return it_nav_cart(inputs)
};