/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_confirm_password_placeholder = /** @type {(inputs: {}) => string} */ () => {
	return `Confirm your password`
};

const de_confirm_password_placeholder = /** @type {(inputs: {}) => string} */ () => {
	return `BestÃ¤tigen Sie Ihr Passwort`
};

const it_confirm_password_placeholder = /** @type {(inputs: {}) => string} */ () => {
	return `Conferma la tua password`
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
export const confirm_password_placeholder = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.confirm_password_placeholder(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("confirm_password_placeholder", locale)
	if (locale === "en") return en_confirm_password_placeholder(inputs)
	if (locale === "de") return de_confirm_password_placeholder(inputs)
	return it_confirm_password_placeholder(inputs)
};