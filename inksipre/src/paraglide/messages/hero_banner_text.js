/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_hero_banner_text = /** @type {(inputs: {}) => string} */ () => {
	return `New customizer! Our 3D designer is live`
};

const de_hero_banner_text = /** @type {(inputs: {}) => string} */ () => {
	return `Neuer Customizer! Unser 3D-Designer ist live`
};

const it_hero_banner_text = /** @type {(inputs: {}) => string} */ () => {
	return `Nuovo personalizzatore! Il nostro designer 3D Ã¨ attivo`
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
export const hero_banner_text = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.hero_banner_text(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("hero_banner_text", locale)
	if (locale === "en") return en_hero_banner_text(inputs)
	if (locale === "de") return de_hero_banner_text(inputs)
	return it_hero_banner_text(inputs)
};