/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_content_feature_instant_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Upload your design and see it applied instantly on realistic 3D surfaces â€” no rendering delays.`
};

const de_content_feature_instant_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Laden Sie Ihr Design hoch und sehen Sie es sofort auf realistischen 3D-OberflÃ¤chen angewendet â€“ keine Render-VerzÃ¶gerungen.`
};

const it_content_feature_instant_desc = /** @type {(inputs: {}) => string} */ () => {
	return `Carica il tuo design e vedi l'applicazione istantanea su superfici 3D realistiche â€” senza ritardi di rendering.`
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
export const content_feature_instant_desc = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.content_feature_instant_desc(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("content_feature_instant_desc", locale)
	if (locale === "en") return en_content_feature_instant_desc(inputs)
	if (locale === "de") return de_content_feature_instant_desc(inputs)
	return it_content_feature_instant_desc(inputs)
};