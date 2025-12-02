/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_register_subtitle = /** @type {(inputs: {}) => string} */ () => {
	return `Create a new account`
};

const de_register_subtitle = /** @type {(inputs: {}) => string} */ () => {
	return `Erstellen Sie ein neues Konto`
};

const it_register_subtitle = /** @type {(inputs: {}) => string} */ () => {
	return `Crea un nuovo account`
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
export const register_subtitle = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.register_subtitle(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("register_subtitle", locale)
	if (locale === "en") return en_register_subtitle(inputs)
	if (locale === "de") return de_register_subtitle(inputs)
	return it_register_subtitle(inputs)
};