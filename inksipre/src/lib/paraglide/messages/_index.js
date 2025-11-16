/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from "../runtime.js"
import * as en from "./en.js"
import * as de from "./de.js"
import * as it from "./it.js"
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
	if (locale === "en") return en.hello_world(inputs)
	if (locale === "de") return de.hello_world(inputs)
	return it.hello_world(inputs)
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
export const nav_home = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_home(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_home", locale)
	if (locale === "en") return en.nav_home(inputs)
	if (locale === "de") return de.nav_home(inputs)
	return it.nav_home(inputs)
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
export const nav_shop = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_shop(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_shop", locale)
	if (locale === "en") return en.nav_shop(inputs)
	if (locale === "de") return de.nav_shop(inputs)
	return it.nav_shop(inputs)
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
export const nav_contact = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_contact(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_contact", locale)
	if (locale === "en") return en.nav_contact(inputs)
	if (locale === "de") return de.nav_contact(inputs)
	return it.nav_contact(inputs)
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
export const nav_admin = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_admin(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_admin", locale)
	if (locale === "en") return en.nav_admin(inputs)
	if (locale === "de") return de.nav_admin(inputs)
	return it.nav_admin(inputs)
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
export const nav_orders = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_orders(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_orders", locale)
	if (locale === "en") return en.nav_orders(inputs)
	if (locale === "de") return de.nav_orders(inputs)
	return it.nav_orders(inputs)
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
export const nav_cart = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_cart(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_cart", locale)
	if (locale === "en") return en.nav_cart(inputs)
	if (locale === "de") return de.nav_cart(inputs)
	return it.nav_cart(inputs)
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
export const nav_greeting = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_greeting(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_greeting", locale)
	if (locale === "en") return en.nav_greeting(inputs)
	if (locale === "de") return de.nav_greeting(inputs)
	return it.nav_greeting(inputs)
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
export const nav_profile = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_profile(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_profile", locale)
	if (locale === "en") return en.nav_profile(inputs)
	if (locale === "de") return de.nav_profile(inputs)
	return it.nav_profile(inputs)
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
export const nav_logout = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_logout(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_logout", locale)
	if (locale === "en") return en.nav_logout(inputs)
	if (locale === "de") return de.nav_logout(inputs)
	return it.nav_logout(inputs)
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
export const nav_login = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_login(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_login", locale)
	if (locale === "en") return en.nav_login(inputs)
	if (locale === "de") return de.nav_login(inputs)
	return it.nav_login(inputs)
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
export const nav_register = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nav_register(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nav_register", locale)
	if (locale === "en") return en.nav_register(inputs)
	if (locale === "de") return de.nav_register(inputs)
	return it.nav_register(inputs)
};