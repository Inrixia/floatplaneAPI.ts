const cookieMiddle = (got, response) => {
	if (response.headers['set-cookie']) got.defaults.options.headers.cookie = response.headers['set-cookie']
	return JSON.parse(response.body)
}

module.exports = class Auth {
	endpoints = {
		login: "https://www.floatplane.com/api/auth/login",
		factor: "https://www.floatplane.com/api/auth/checkFor2faLogin"
	}
	constructor(got) {
		this.got = got
	}

	/**
	 * @typedef {{ 
		needs2FA: boolean
		user: {
			id: string,
			username: string,
			profileImage: {
				width: number,
				height: number,
				path: string,
				childImages: Array<{ width: number, height: number, path: string }>
			}
		}
	}} user
	*/

	/**
	 * Login to floatplane using provided credentials.
	 * @param {string} username Username/Email
	 * @param {string} password Password
	 * @returns {Promise<user>} User object OR `{ needs2FA: true }` if user requires 2 Factor authentication.
	*/
	login = async (username, password) => cookieMiddle(this.got, await this.got.post(this.endpoints.login, {
		method: 'POST',
		json: { username, password }
	}))

	/**
	* Login using provided 2Factor token.
	* @param {string} token
	* @returns {Promise<user>} User object
	*/
	factor = async token => cookieMiddle(this.got, await this.got.post(this.endpoints.factor, {
		method: 'POST',
		json: { token: token.toString() }
	}))
}