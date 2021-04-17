import Core from "../Core";
import type { Image } from "../lib/types";

export type LoginSuccess = { 
	user: {
		id: string,
		username: string,
		profileImage: Image
	},
	needs2FA: false
}
export type Needs2FA = { needs2FA: true }
export type LoginResponse = Promise<LoginSuccess|Needs2FA>

export default class Auth extends Core {
	endpoints = {
		login: "https://www.floatplane.com/api/auth/login",
		factor: "https://www.floatplane.com/api/auth/checkFor2faLogin"
	}

	/**
	 * Login to floatplane using provided credentials.
	 * @param {string} username Username/Email
	 * @param {string} password Password
	 * @param {string} captchaToken Recaptcha token (single use). Not required.
	 * @returns {LoginResponse} User object OR `{ needs2FA: true }` if user requires 2 Factor authentication.
	 * 
	 * @example
	 * // captchaToken is not required for login.
	 * // Get a single use captchaToken by going to floatplane.com/login and running 
	 * grecaptcha.execute('6LfwnJ0aAAAAANTkEF2M1LfdKx2OpWAxPtiHISqr', { action:'login' }).then(console.log)
	 * // in console.
	*/
	login = async (username: string, password: string, captchaToken?: string): Promise<LoginResponse> => JSON.parse(
		await this.got.post(this.endpoints.login, {
			method: "POST",
			json: { username, password, captchaToken },
			resolveBodyOnly: true
		})
	)


	/**
	* Login using provided 2Factor token.
	* @param {string} token 2 Factor Authentication token (single use)
	* @returns {Promise<User>} User object
	*/
	factor = async (token: string): Promise<LoginSuccess> => JSON.parse(
		await this.got.post(this.endpoints.factor, {
			method: "POST",
			json: { token: token.toString() },
			resolveBodyOnly: true
		})
	)
}