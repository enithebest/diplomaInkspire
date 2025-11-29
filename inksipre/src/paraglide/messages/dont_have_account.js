/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_dont_have_account = /** @type {(inputs: {}) => string} */ () => {
	return `Don't have an account?`
};

const de_dont_have_account = /** @type {(inputs: {}) => string} */ () => {
	return `Haben Sie kein Konto?`
};

const it_dont_have_account = /** @type {(inputs: {}) => string} */ () => {
	return `Non hai un account?`
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
export const dont_have_account = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.dont_have_account(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("dont_have_account", locale)
	if (locale === "en") return en_dont_have_account(inputs)
	if (locale === "de") return de_dont_have_account(inputs)
	return it_dont_have_account(inputs)
};