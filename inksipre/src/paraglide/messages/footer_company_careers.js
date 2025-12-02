/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_footer_company_careers = /** @type {(inputs: {}) => string} */ () => {
	return `Careers`
};

const de_footer_company_careers = /** @type {(inputs: {}) => string} */ () => {
	return `Karriere`
};

const it_footer_company_careers = /** @type {(inputs: {}) => string} */ () => {
	return `Lavora con noi`
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
export const footer_company_careers = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.footer_company_careers(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("footer_company_careers", locale)
	if (locale === "en") return en_footer_company_careers(inputs)
	if (locale === "de") return de_footer_company_careers(inputs)
	return it_footer_company_careers(inputs)
};