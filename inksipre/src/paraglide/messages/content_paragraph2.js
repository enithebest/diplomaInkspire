/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_content_paragraph2 = /** @type {(inputs: {}) => string} */ () => {
	return `From startup branding kits to full product campaigns, our 3D mockup platform makes visualization intuitive and fast â€” no modeling experience required.`
};

const de_content_paragraph2 = /** @type {(inputs: {}) => string} */ () => {
	return `Von Startup-Branding-Kits bis hin zu kompletten Produktkampagnen macht unsere 3D-Mockup-Plattform die Visualisierung intuitiv und schnell â€” keine Modelliererfahrung erforderlich.`
};

const it_content_paragraph2 = /** @type {(inputs: {}) => string} */ () => {
	return `Dai kit di branding per startup alle campagne prodotto complete, la nostra piattaforma di mockup 3D rende la visualizzazione intuitiva e veloce â€” nessuna esperienza di modellazione richiesta.`
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
export const content_paragraph2 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.content_paragraph2(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("content_paragraph2", locale)
	if (locale === "en") return en_content_paragraph2(inputs)
	if (locale === "de") return de_content_paragraph2(inputs)
	return it_content_paragraph2(inputs)
};