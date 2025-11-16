/* eslint-disable */


export const hello_world = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Ciao, ${i.name} dall'it!`
};

export const nav_home = /** @type {(inputs: {}) => string} */ () => {
	return `Home`
};

export const nav_shop = /** @type {(inputs: {}) => string} */ () => {
	return `Negozio`
};

export const nav_contact = /** @type {(inputs: {}) => string} */ () => {
	return `Contatti`
};

export const nav_admin = /** @type {(inputs: {}) => string} */ () => {
	return `Admin`
};

export const nav_orders = /** @type {(inputs: {}) => string} */ () => {
	return `Ordini`
};

export const nav_cart = /** @type {(inputs: {}) => string} */ () => {
	return `Carrello`
};

export const nav_greeting = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Benvenuto/a, ${i.name}`
};

export const nav_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profilo`
};

export const nav_logout = /** @type {(inputs: {}) => string} */ () => {
	return `Esci`
};

export const nav_login = /** @type {(inputs: {}) => string} */ () => {
	return `Accedi`
};

export const nav_register = /** @type {(inputs: {}) => string} */ () => {
	return `Registrati`
};