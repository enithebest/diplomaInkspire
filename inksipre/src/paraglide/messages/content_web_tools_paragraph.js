/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_content_web_tools_paragraph = /** @type {(inputs: {}) => string} */ () => {
	return `Design, preview, and export your mockups directly from your browser. Collaborate in real time, share links, or download high-res renders instantly. Simplify your creative workflow today.`
};

const de_content_web_tools_paragraph = /** @type {(inputs: {}) => string} */ () => {
	return `Entwerfen, Vorschauen und exportieren Sie Ihre Mockups direkt aus dem Browser. In Echtzeit zusammenarbeiten, Links teilen oder hochauflÃ¶sende Renderings sofort herunterladen. Vereinfachen Sie noch heute Ihren kreativen Workflow.`
};

const it_content_web_tools_paragraph = /** @type {(inputs: {}) => string} */ () => {
	return `Progetta, visualizza ed esporta i tuoi mockup direttamente dal browser. Collabora in tempo reale, condividi link o scarica render ad alta risoluzione istantaneamente. Semplifica oggi il tuo flusso creativo.`
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
export const content_web_tools_paragraph = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.content_web_tools_paragraph(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("content_web_tools_paragraph", locale)
	if (locale === "en") return en_content_web_tools_paragraph(inputs)
	if (locale === "de") return de_content_web_tools_paragraph(inputs)
	return it_content_web_tools_paragraph(inputs)
};