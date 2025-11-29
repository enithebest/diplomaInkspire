/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_login_here = /** @type {(inputs: {}) => string} */ () => {
	return `Login here`
};

const de_login_here = /** @type {(inputs: {}) => string} */ () => {
	return `Hier anmelden`
};

const it_login_here = /** @type {(inputs: {}) => string} */ () => {
	return `Accedi qui`
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
export const login_here = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.login_here(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("login_here", locale)
	if (locale === "en") return en_login_here(inputs)
	if (locale === "de") return de_login_here(inputs)
	return it_login_here(inputs)
};