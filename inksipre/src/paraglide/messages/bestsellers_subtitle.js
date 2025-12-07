/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_bestsellers_subtitle = /** @type {(inputs: {}) => string} */ () => {
	return `Our most-loved products right now`
};

const de_bestsellers_subtitle = /** @type {(inputs: {}) => string} */ () => {
	return `Unsere beliebtesten Produkte gerade jetzt`
};

const it_bestsellers_subtitle = /** @type {(inputs: {}) => string} */ () => {
	return `I nostri prodotti piÃ¹ amati in questo momento`
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
export const bestsellers_subtitle = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.bestsellers_subtitle(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("bestsellers_subtitle", locale)
	if (locale === "en") return en_bestsellers_subtitle(inputs)
	if (locale === "de") return de_bestsellers_subtitle(inputs)
	return it_bestsellers_subtitle(inputs)
};