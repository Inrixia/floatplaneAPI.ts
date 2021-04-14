import got from "got";

import { CookieJar } from "tough-cookie";

import Auth from "./auth";
import User from "./user";
import Api from "./api";
import Creator from "./creator";
import CDN from "./cdn";
import Sails from "./sails";

import type { LoginSuccess } from "./auth";

export type LoginOptions = {
	username: string,
	password: string,
	token: string
}
export default class Floatplane {
	public got: typeof got;

	public auth: Auth
	public user: User
	public api: Api
	public creator: Creator
	public cdn: CDN
	public sails: Sails


	constructor(cookieJar?: CookieJar) {
		cookieJar ??= new CookieJar();
		this.got = got.extend({ // Sets the global requestMethod to be used, this maintains headers
			cookieJar,
			headers: {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				"User-Agent": `FloatplaneAPI/${require("./package.json").version} (Inrix, +https://github.com/Inrixia/floatplaneAPI.ts)`,
				"accept": "application/json",
				"connection": "keep-alive"
			}
		});
		this.auth = new Auth(this.got);
		this.user = new User(this.got);
		this.api = new Api(this.got);
		this.creator = new Creator(this.got);
		this.cdn = new CDN(this.got);
		this.sails = new Sails(cookieJar);
	}

	/**
	 * Login to floatplane so future requests are authenticated
	 * @param {LoginOptions} options Login options
	 * @param {string} options.username Username to login with
	 * @param {string} options.password Password to login with
	 * @param {string} options.token 2 Factor token to login with
	 * @returns {Promise<LoginSuccess>} User object OR `{ needs2FA: true }` if user requires 2 Factor authentication.
	*/
	login = async (options: LoginOptions): Promise<LoginSuccess> => {
		if (typeof options.username !== "string") throw new Error("Username must be a string!");
		if (typeof options.password !== "string") throw new Error("Password must be a string!");
		
		let result = await this.auth.login(options.username, options.password);

		if (result.needs2FA === true) {
			if (typeof options.token !== "string") throw new Error("Token must be a string!");
			result = await this.auth.factor(options.token);
		}
		return result;
	}

	/**
	 * Returns true if authenticated or Error if not.
	 */
	isAuthenticated = async (): Promise<Error | true> => this.user.self().catch((err: Error) => err).then(() => true);
}