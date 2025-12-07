/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_nav_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profile`
};

const de_nav_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profil`
};

const it_nav_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profilo`
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
export const nav_profile = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_profile(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_profile", locale)
	if (locale === "en") return en_nav_profile(inputs)
	if (locale === "de") return de_nav_profile(inputs)
	return it_nav_profile(inputs)
};