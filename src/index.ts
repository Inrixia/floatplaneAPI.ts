import got from "got";

import { CookieJar } from "tough-cookie";

import { Auth } from "./auth.js";
import { User } from "./user.js";
import { Api } from "./api.js";
import { Creator } from "./creator.js";
import { CDN } from "./cdn.js";

import type { LoginSuccess } from "./auth.js";

export type LoginOptions = {
	username: string;
	password: string;
	captchaToken?: string;
	token?: string;
};

import fs from "fs";
const { version } = JSON.parse(fs.readFileSync("../package.json").toString());

export const headers = {
	"User-Agent": `FloatplaneAPI/${version} (Inrix, +https://github.com/Inrixia/floatplaneAPI.ts), CFNetwork`,
	accept: "application/json",
	connection: "keep-alive",
};

export class Floatplane {
	public got: typeof got;

	public auth: Auth;
	public user: User;
	public api: Api;
	public creator: Creator;
	public cdn: CDN;
	constructor(cookieJar?: CookieJar) {
		cookieJar ??= new CookieJar();
		this.got = got.extend({
			// Sets the global requestMethod to be used, this maintains headers
			cookieJar,
			headers,
			// prefixUrl: "https://www.floatplane.com",
		});
		this.auth = new Auth(this.got);
		this.user = new User(this.got);
		this.api = new Api(this.got);
		this.creator = new Creator(this.got);
		this.cdn = new CDN(this.got);
	}

	/**
	 * Login to floatplane so future requests are authenticated
	 * @param {LoginOptions} options Login options
	 * @param {string} options.username Username
	 * @param {string} options.password Password
	 * @param {string} options.captchaToken Recaptcha token (single use). Not required
	 * @param {string} options.token 2 Factor Authentication token (single use)
	 * @returns {Promise<LoginSuccess>} User object.
	 *
	 * @example
	 * // captchaToken is not required for login.
	 * // Get a single use captchaToken by going to floatplane.com/login and running
	 * grecaptcha.execute('6LfwnJ0aAAAAANTkEF2M1LfdKx2OpWAxPtiHISqr', { action:'login' }).then(console.log)
	 * // in console.
	 */
	login = async (options: LoginOptions): Promise<LoginSuccess> => {
		if (typeof options.username !== "string") throw new Error("Username must be a string!");
		if (typeof options.password !== "string") throw new Error("Password must be a string!");
		if (typeof options.captchaToken !== "string" && options.captchaToken !== undefined) throw new Error("Recaptcha Token must be a string or undefined!");

		let result = await this.auth.login(options.username, options.password, options.captchaToken);

		if (result.needs2FA === true) {
			if (typeof options.token !== "string") throw new Error("2FA Token must be a string!");
			result = await this.auth.factor(options.token);
		}
		return result;
	};

	/**
	 * Returns true if authenticated or Error if not.
	 */
	isAuthenticated = async (): Promise<Error | true> =>
		this.user
			.self()
			.then((): true => true)
			.catch((err: Error) => err);
}
