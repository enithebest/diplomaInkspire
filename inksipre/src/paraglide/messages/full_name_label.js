/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_full_name_label = /** @type {(inputs: {}) => string} */ () => {
	return `Full name`
};

const de_full_name_label = /** @type {(inputs: {}) => string} */ () => {
	return `VollstÃ¤ndiger Name`
};

const it_full_name_label = /** @type {(inputs: {}) => string} */ () => {
	return `Nome e cognome`
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
export const full_name_label = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.full_name_label(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("full_name_label", locale)
	if (locale === "en") return en_full_name_label(inputs)
	if (locale === "de") return de_full_name_label(inputs)
	return it_full_name_label(inputs)
};