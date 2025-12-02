/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_bestsellers_sold = /** @type {(inputs: { count: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.count} sold`
};

const de_bestsellers_sold = /** @type {(inputs: { count: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.count} verkauft`
};

const it_bestsellers_sold = /** @type {(inputs: { count: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.count} venduti`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ count: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "de" | "it" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const bestsellers_sold = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.bestsellers_sold(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("bestsellers_sold", locale)
	if (locale === "en") return en_bestsellers_sold(inputs)
	if (locale === "de") return de_bestsellers_sold(inputs)
	return it_bestsellers_sold(inputs)
};