/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_email_placeholder = /** @type {(inputs: {}) => string} */ () => {
	return `Enter your email`
};

const de_email_placeholder = /** @type {(inputs: {}) => string} */ () => {
	return `Geben Sie Ihre E-Mail ein`
};

const it_email_placeholder = /** @type {(inputs: {}) => string} */ () => {
	return `Inserisci la tua email`
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
export const email_placeholder = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.email_placeholder(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("email_placeholder", locale)
	if (locale === "en") return en_email_placeholder(inputs)
	if (locale === "de") return de_email_placeholder(inputs)
	return it_email_placeholder(inputs)
};