/* eslint-disable */


export const hello_world = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Hallo, ${i.name} aus de!`
};

export const nav_home = /** @type {(inputs: {}) => string} */ () => {
	return `Startseite`
};

export const nav_shop = /** @type {(inputs: {}) => string} */ () => {
	return `Shop`
};

export const nav_contact = /** @type {(inputs: {}) => string} */ () => {
	return `Kontakt`
};

export const nav_admin = /** @type {(inputs: {}) => string} */ () => {
	return `Admin`
};

export const nav_orders = /** @type {(inputs: {}) => string} */ () => {
	return `Bestellungen`
};

export const nav_cart = /** @type {(inputs: {}) => string} */ () => {
	return `Warenkorb`
};

export const nav_greeting = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Willkommen, ${i.name}`
};

export const nav_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profil`
};

export const nav_logout = /** @type {(inputs: {}) => string} */ () => {
	return `Abmelden`
};

export const nav_login = /** @type {(inputs: {}) => string} */ () => {
	return `Anmelden`
};

export const nav_register = /** @type {(inputs: {}) => string} */ () => {
	return `Registrieren`
};