module.exports = class Core {
	constructor(got) {
		if (!got.defaults.options.mutableDefaults) throw new Error('got must be extended with mutableDefaults set true! Please pass got.extend({ mutableDefaults: true })...')
		this.got = got
		this._cookie = {}
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
	set cookie(cookie) {
		this.got.defaults.options.headers.cookie = cookie
	}
}