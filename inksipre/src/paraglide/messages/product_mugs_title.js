/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_product_mugs_title = /** @type {(inputs: {}) => string} */ () => {
	return `Mugs`
};

const de_product_mugs_title = /** @type {(inputs: {}) => string} */ () => {
	return `Tassen`
};

const it_product_mugs_title = /** @type {(inputs: {}) => string} */ () => {
	return `Tazze`
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
export const product_mugs_title = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.product_mugs_title(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("product_mugs_title", locale)
	if (locale === "en") return en_product_mugs_title(inputs)
	if (locale === "de") return de_product_mugs_title(inputs)
	return it_product_mugs_title(inputs)
};