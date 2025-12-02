/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_ok_button = /** @type {(inputs: {}) => string} */ () => {
	return `OK`
};

const de_ok_button = /** @type {(inputs: {}) => string} */ () => {
	return `OK`
};

const it_ok_button = /** @type {(inputs: {}) => string} */ () => {
	return `OK`
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
export const ok_button = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.ok_button(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("ok_button", locale)
	if (locale === "en") return en_ok_button(inputs)
	if (locale === "de") return de_ok_button(inputs)
	return it_ok_button(inputs)
};