/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_hello_world = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Hello, ${i.name} from en!`
};

const de_hello_world = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Hallo, ${i.name} aus de!`
};

const it_hello_world = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Ciao, ${i.name} dall'it!`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ name: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "de" | "it" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const hello_world = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.hello_world(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("hello_world", locale)
	if (locale === "en") return en_hello_world(inputs)
	if (locale === "de") return de_hello_world(inputs)
	return it_hello_world(inputs)
};