/* eslint-disable */


export const hello_world = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Hello, ${i.name} from en!`
};

export const nav_home = /** @type {(inputs: {}) => string} */ () => {
	return `Home`
};

export const nav_shop = /** @type {(inputs: {}) => string} */ () => {
	return `Shop`
};

export const nav_contact = /** @type {(inputs: {}) => string} */ () => {
	return `Contact`
};

export const nav_admin = /** @type {(inputs: {}) => string} */ () => {
	return `Admin`
};

export const nav_orders = /** @type {(inputs: {}) => string} */ () => {
	return `Orders`
};

export const nav_cart = /** @type {(inputs: {}) => string} */ () => {
	return `Cart`
};

export const nav_greeting = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Welcome, ${i.name}`
};

export const nav_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profile`
};

export const nav_logout = /** @type {(inputs: {}) => string} */ () => {
	return `Log out`
};

export const nav_login = /** @type {(inputs: {}) => string} */ () => {
	return `Log in`
};

export const nav_register = /** @type {(inputs: {}) => string} */ () => {
	return `Register`
};