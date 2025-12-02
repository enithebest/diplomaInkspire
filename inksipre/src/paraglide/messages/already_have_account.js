/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_already_have_account = /** @type {(inputs: {}) => string} */ () => {
	return `Already have an account?`
};

const de_already_have_account = /** @type {(inputs: {}) => string} */ () => {
	return `Haben Sie bereits ein Konto?`
};

const it_already_have_account = /** @type {(inputs: {}) => string} */ () => {
	return `Hai giÃ  un account?`
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
export const already_have_account = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.already_have_account(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("already_have_account", locale)
	if (locale === "en") return en_already_have_account(inputs)
	if (locale === "de") return de_already_have_account(inputs)
	return it_already_have_account(inputs)
};