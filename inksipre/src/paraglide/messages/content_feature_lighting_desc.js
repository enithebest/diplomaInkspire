/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_content_feature_lighting_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Adjust light, shadows, and reflections with a simple slider to match your brand mood.`
};

const de_content_feature_lighting_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Passen Sie Licht, Schatten und Reflexionen mit einem einfachen Schieberegler an, um die Stimmung Ihrer Marke zu treffen.`
};

const it_content_feature_lighting_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Regola luci, ombre e riflessi con un semplice cursore per adattare l'atmosfera al tuo brand.`
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
export const content_feature_lighting_desc = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.content_feature_lighting_desc(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("content_feature_lighting_desc", locale)
	if (locale === "en") return en_content_feature_lighting_desc(inputs)
	if (locale === "de") return de_content_feature_lighting_desc(inputs)
	return it_content_feature_lighting_desc(inputs)
};