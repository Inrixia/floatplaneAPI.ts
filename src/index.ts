import got from "got";

import { CookieJar } from "tough-cookie";

import { Auth } from "./auth";
import { User } from "./user";
import { Api } from "./api";
import { Creator } from "./creator";
import { CDN } from "./cdn";

import type { LoginSuccess } from "./auth";

export type LoginOptions = {
	username: string;
	password: string;
	captchaToken?: string;
	token?: string;
};

// Shitty fix now that im using these headers in tests
let version;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	version = require("./package.json").version;
} catch {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	version = require("../package.json").version;
}

export const headers = {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
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
