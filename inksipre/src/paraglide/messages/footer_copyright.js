/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_footer_copyright = /** @type {(inputs: { year: NonNullable<unknown> }) => string} */ (i) => {
	return `Â© ${i.year} Inkspire. All rights reserved.`
};

const de_footer_copyright = /** @type {(inputs: { year: NonNullable<unknown> }) => string} */ (i) => {
	return `Â© ${i.year} Inkspire. Alle Rechte vorbehalten.`
};

const it_footer_copyright = /** @type {(inputs: { year: NonNullable<unknown> }) => string} */ (i) => {
	return `Â© ${i.year} Inkspire. Tutti i diritti riservati.`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ year: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "de" | "it" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const footer_copyright = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.footer_copyright(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("footer_copyright", locale)
	if (locale === "en") return en_footer_copyright(inputs)
	if (locale === "de") return de_footer_copyright(inputs)
	return it_footer_copyright(inputs)
};