/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_hero_banner_cta = /** @type {(inputs: {}) => string} */ () => {
	return `Try It`
};

const de_hero_banner_cta = /** @type {(inputs: {}) => string} */ () => {
	return `Probier's aus`
};

const it_hero_banner_cta = /** @type {(inputs: {}) => string} */ () => {
	return `Provalo`
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
export const hero_banner_cta = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.hero_banner_cta(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("hero_banner_cta", locale)
	if (locale === "en") return en_hero_banner_cta(inputs)
	if (locale === "de") return de_hero_banner_cta(inputs)
	return it_hero_banner_cta(inputs)
};