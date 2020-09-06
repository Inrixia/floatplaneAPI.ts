const Core = require('../core.js')

module.exports = class Auth extends Core {
	endpoints = {
		login: "https://www.floatplane.com/api/auth/login",
		factor: "https://www.floatplane.com/api/auth/checkFor2faLogin"
	}

	/**
	 * @typedef {{ 
		needs2FA: boolean,
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
	login = async (username, password) => this._middleware(await this.got.post(this.endpoints.login, {
		method: 'POST',
		json: { username, password }
	}))

	/**
	* Login using provided 2Factor token.
	* @param {string} token
	* @returns {Promise<user>} User object
	*/
	factor = async token => this._middleware(await this.got.post(this.endpoints.factor, {
		method: 'POST',
		json: { token: token.toString() }
	}))
}