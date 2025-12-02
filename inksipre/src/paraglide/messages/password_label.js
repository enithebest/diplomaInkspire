/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_password_label = /** @type {(inputs: {}) => string} */ () => {
	return `Password`
};

const de_password_label = /** @type {(inputs: {}) => string} */ () => {
	return `Passwort`
};

const it_password_label = /** @type {(inputs: {}) => string} */ () => {
	return `Password`
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
export const password_label = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.password_label(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("password_label", locale)
	if (locale === "en") return en_password_label(inputs)
	if (locale === "de") return de_password_label(inputs)
	return it_password_label(inputs)
};