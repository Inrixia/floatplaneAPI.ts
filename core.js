module.exports = class Core {
	constructor(got) {
		if (!got.defaults.options.mutableDefaults) throw new Error('got must be extended with mutableDefaults set true! Please pass got.extend({ mutableDefaults: true })...')
		this.got = got
		if (this.got.defaults.options.headers.cookie === undefined) this.got.defaults.options.headers.cookie = []
	}

	/**
	 * Takes in a response and applies cookies in the set-cookie header to got if it exists.
	 * @param {*} response 
	 * @returns {object} JSON.parsed response body
	 */
	_middleware = response => {
		if (response.headers['set-cookie']) this.cookie = response.headers['set-cookie']
		return JSON.parse(response.body)
	}

	/**
	 * `got` session headers used for requests.
	 */
	get headers() {
		return this.got.defaults.options.headers
	}
	set headers(headers) {
		this.got.defaults.options.headers = headers
	}

	/**
	 * `got` session cookies. Use to persist login.
	 */
	get cookie() {
		return this.got.defaults.options.headers.cookie
	}
	set cookie(cookies) {
		if (!Array.isArray(cookies)) throw new Error(`typeof cookie is ${typeof cookies} must be Array!`)
		const reducer = (cookieStore, cookie) => ({ ...cookieStore, [cookie.split("=", 1)[0]]: cookie })
		this.got.defaults.options.headers.cookie = Object.values({ ...cookies.reduce(reducer, {}), ...this.cookie.reduce(reducer, {}) })
	}
}