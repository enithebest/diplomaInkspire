/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_product_hoodie_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Comfortable cotton hoodie with premium print.`
};

const de_product_hoodie_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Bequemer Baumwoll-Hoodie mit hochwertigem Druck.`
};

const it_product_hoodie_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Felpa comoda in cotone con stampa di alta qualitÃ .`
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
export const product_hoodie_desc = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.product_hoodie_desc(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("product_hoodie_desc", locale)
	if (locale === "en") return en_product_hoodie_desc(inputs)
	if (locale === "de") return de_product_hoodie_desc(inputs)
	return it_product_hoodie_desc(inputs)
};