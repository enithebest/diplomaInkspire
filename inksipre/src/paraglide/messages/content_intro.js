/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_content_intro = /** @type {(inputs: {}) => string} */ () => {
	return `Showcase your products, apps, or packaging with high-quality 3D visuals that impress clients and boost conversions â€” all from your browser.`
};

const de_content_intro = /** @type {(inputs: {}) => string} */ () => {
	return `PrÃ¤sentieren Sie Ihre Produkte, Apps oder Verpackungen mit hochwertigen 3D-Visuals, die Kunden beeindrucken und die Conversion-Rate steigern â€“ alles direkt im Browser.`
};

const it_content_intro = /** @type {(inputs: {}) => string} */ () => {
	return `Mostra i tuoi prodotti, app o packaging con visual 3D di alta qualitÃ  che impressionano i clienti e aumentano le conversioni â€” tutto dal tuo browser.`
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
export const content_intro = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.content_intro(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("content_intro", locale)
	if (locale === "en") return en_content_intro(inputs)
	if (locale === "de") return de_content_intro(inputs)
	return it_content_intro(inputs)
};