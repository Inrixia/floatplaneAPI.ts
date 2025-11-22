import got from "got";

import { Api } from "./api.js";
import { Auth } from "./auth.js";
import { CDN } from "./cdn.js";
import { Creator } from "./creator.js";
import { User } from "./user.js";
import * as client from "openid-client";

import type { LoginSuccess } from "./auth.js";
import { Content } from "./content.js";
import { TokenEndpointResponse } from "openid-client";
import { isDate } from "util/types";


export const version = "4.6.0";

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
	public content: Content;
	private settings: { baseUrl: string, auth: { tokenSet: TokenEndpointResponse & {expires_at?: Date | string} | null, tokenSetHook?: (tokenSet: TokenEndpointResponse & {expires_at?: Date}) => void, clientSettings: { server: string, clientId: string, clientSecret?: string } } };
	private get tokenSet() {
		return this.settings.auth.tokenSet;
	}
	private set tokenSet(value: TokenEndpointResponse & {expires_at?: Date | string} | null) {
		if (value !== null && value.expires_in){
			value.expires_at = new Date(Date.now() + value.expires_in * 1000);
		}

		if (this.settings.auth.tokenSetHook && value !== null) {
			if (typeof value.expires_at === "string") {
				value.expires_at = new Date(value.expires_at);
			}
			this.settings.auth.tokenSetHook(value as TokenEndpointResponse & { expires_at?: Date });
		}
		
		this.settings.auth.tokenSet = value;
	}
	private oauthConfig: client.Configuration | undefined;

	constructor(authConfig: { tokenSet: TokenEndpointResponse & {expires_at?: Date | string} | null, tokenSetHook?: (tokenSet: TokenEndpointResponse & {expires_at?: Date | string}) => void, clientSettings: { server: string, clientId: string, clientSecret?: string } }, userAgent?: string, baseUrl: string = "https://www.floatplane.com") {
		this.settings = {
			baseUrl,
			auth: authConfig,
		};
		
		if (userAgent !== undefined) headers["User-Agent"] = userAgent;
		this.got = got.extend({
			headers,
			retry: {
				limit: 5, // Maximum number of retries
			},
			hooks: {
				beforeRequest: [
					async (options) => {
						if (!this.tokenSet) {
							await this.login();
						}
						else {
							const expires = this.expiresIn(this.tokenSet);
							if (expires === undefined || expires < 60) {
								const refreshToken = this.tokenSet.refresh_token;
								if (!refreshToken) {
									// Corrupted?
									this.tokenSet = null;
									throw new Error("No refresh token available to refresh OAuth token!");
								}
								if (!this.oauthConfig) {
									throw new Error("No OAuth configuration available to refresh token!");
								}
								const refreshedTokenSet = await client.refreshTokenGrant(this.oauthConfig, refreshToken);
								if (refreshedTokenSet.access_token === undefined) throw new Error("No access token received when refreshing token!");
								this.tokenSet = refreshedTokenSet;
								console.log("Refreshed Floatplane OAuth token.");
							}
						}

						if (this.tokenSet?.access_token) {
							options.headers.authorization = `Bearer ${this.tokenSet.access_token}`;
						}
					},
				],
			},
		});
		this.auth = new Auth(this.got, baseUrl);
		this.user = new User(this.got, baseUrl);
		this.api = new Api(this.got, baseUrl);
		this.creator = new Creator(this.got, baseUrl);
		this.cdn = new CDN(this.got, baseUrl);
		this.content = new Content(this.got, baseUrl);
	}

	public extend(...params: Parameters<typeof got.extend>) {
		this.got = this.got.extend(...params);
		this.auth.got = this.got;
		this.user.got = this.got;
		this.api.got = this.got;
		this.creator.got = this.got;
		this.cdn.got = this.got;
		this.content.got = this.got;
	}

	expiresIn(tokenSet: TokenEndpointResponse & {expires_at?: Date | string} | undefined): number | undefined {
		let exp = tokenSet?.expires_at
		if (typeof exp === "string") {
				exp = new Date(tokenSet?.expires_at as string);
		}
		if (tokenSet && exp && isDate(exp)) {
			if (exp) {
				const now = new Date();
				if (exp > now) {
					return Math.floor((exp.getTime() - now.getTime()) / 1000);
				}
				return 0;
			}
		}
		return undefined;
	}

	private login = async (): Promise<undefined> => {
		await this.deviceLogin();
		return;
	}

	/**
	 * Login to floatplane so future requests are authenticated using the Device flow
	 * @returns {Promise<User>} User object.
	 */
	deviceLogin = async (fn?: (response: client.DeviceAuthorizationResponse) => any): Promise<any> => {
		const scope = "openid profile email offline_access";

		if (this.oauthConfig === undefined) {
			this.oauthConfig = await client.discovery(new URL(this.settings.auth.clientSettings?.server), this.settings.auth!.clientSettings?.clientId, this.settings.auth!.clientSettings?.clientSecret);
		}

		if (!this.tokenSet) {
			const response = await client.initiateDeviceAuthorization(this.oauthConfig, { scope });
			if (fn) {
				fn(response);
			}
			else {
				console.log("Complete login using this verification URL: ", response.verification_uri_complete);
			}
			const tokenSet = await client.pollDeviceAuthorizationGrant(this.oauthConfig, response);

			if (tokenSet.access_token === undefined) throw new Error("No access token received from device authorization flow!");

			this.tokenSet = tokenSet;
		}

		return await this.user.self();
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
