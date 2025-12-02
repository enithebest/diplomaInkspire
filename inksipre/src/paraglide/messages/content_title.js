/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_content_title = /** @type {(inputs: {}) => string} */ () => {
	return `Realistic 3D Mockups in Minutes`
};

const de_content_title = /** @type {(inputs: {}) => string} */ () => {
	return `Realistische 3D-Mockups in Minuten`
};

const it_content_title = /** @type {(inputs: {}) => string} */ () => {
	return `Mockup 3D realistici in pochi minuti`
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
export const content_title = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.content_title(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("content_title", locale)
	if (locale === "en") return en_content_title(inputs)
	if (locale === "de") return de_content_title(inputs)
	return it_content_title(inputs)
};