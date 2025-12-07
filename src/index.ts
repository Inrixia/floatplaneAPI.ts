import got from "got";

import * as client from "openid-client";
import { Api } from "./api.js";
import { CDN } from "./cdn.js";
import { Creator } from "./creator.js";
import { User } from "./user.js";

import { TokenEndpointResponse } from "openid-client";
import { isDate } from "util/types";
import { Content } from "./content.js";
import { Core } from "./Core.js";

export const version = "5.2.0";

export type AuthToken = TokenEndpointResponse & { expires_at?: Date };
export type OnDeviceCode = (response: client.DeviceAuthorizationResponse) => any;
export type OnAuthToken = (authToken: AuthToken) => void;
export type AuthConfig = {
	authToken?: AuthToken;
	onAuthToken?: OnAuthToken;
	onDeviceCode: OnDeviceCode;
	clientId: string;
	clientSecret?: string;
	serverUrl?: string;
};
export type FloatplaneSettings = {
	authConfig: AuthConfig;
	userAgent?: string;
	baseUrl?: string;
};
export class Floatplane {
	public got: typeof got;

	public user: User;
	public api: Api;
	public creator: Creator;
	public cdn: CDN;
	public content: Content;

	private oauthConfig?: client.Configuration;
	public readonly authConfig: AuthConfig;

	public readonly userAgent: string = `FloatplaneAPI/${version} (Inrix, +https://github.com/Inrixia/floatplaneAPI.ts), CFNetwork`;

	constructor({ authConfig, baseUrl, userAgent }: FloatplaneSettings) {
		this.authConfig = authConfig;

		baseUrl ??= Core.BaseUrl;

		const headers = {
			"User-Agent": userAgent ?? this.userAgent,
			accept: "application/json",
			connection: "keep-alive",
		};

		this.got = got.extend({
			headers,
			retry: {
				limit: 5, // Maximum number of retries
			},
			hooks: {
				beforeRequest: [
					async ({ headers, url, prefixUrl }) => {
						if (!new URL(url ?? prefixUrl).href.startsWith(baseUrl)) return;
						await this.refreshAuthToken();
						if (this.authToken?.access_token) headers.authorization = `Bearer ${this.authToken.access_token}`;
					},
				],
			},
		});

		this.user = new User(this.got, baseUrl);
		this.api = new Api(this.got, baseUrl);
		this.creator = new Creator(this.got, baseUrl);
		this.cdn = new CDN(this.got, baseUrl);
		this.content = new Content(this.got, baseUrl);
	}

	public extend(...params: Parameters<typeof got.extend>) {
		this.got = this.got.extend(...params);
		this.user.got = this.got;
		this.api.got = this.got;
		this.creator.got = this.got;
		this.cdn.got = this.got;
		this.content.got = this.got;
	}

	private get authToken() {
		return this.authConfig.authToken;
	}
	private set authToken(value: AuthToken | null | undefined) {
		if (this.authConfig.onAuthToken && value) this.authConfig.onAuthToken(value);
		this.authConfig.authToken = value ?? undefined;
	}

	expiresIn(tokenSet?: AuthToken): number | undefined {
		if (tokenSet?.expires_at && isDate(tokenSet.expires_at)) {
			const exp = tokenSet.expires_at;
			if (exp) {
				const now = new Date();
				if (exp > now) return Math.floor((exp.getTime() - now.getTime()) / 1000);
				return 0;
			}
		}
		return undefined;
	}

	async refreshAuthToken(): Promise<unknown> {
		if (!this.authToken) return this.login();

		const expires = this.expiresIn(this.authToken);
		if (!expires || expires < 60) {
			const refreshToken = this.authToken.refresh_token;
			if (!refreshToken) {
				console.warn("[floatplane.api] - No refresh token available to refresh OAuth token! Falling back to login...");
				// Corrupted?
				this.authToken = null;
				return this.login();
			}
			if (!this.oauthConfig) throw new Error("No OAuth configuration available to refresh token!");
			const refreshedTokenSet = await client.refreshTokenGrant(this.oauthConfig, refreshToken);

			if (refreshedTokenSet.access_token === undefined) throw new Error("No access token received when refreshing token!");
			this.authToken = refreshedTokenSet;
		}
	}

	/**
	 * Login to floatplane so future requests are authenticated using the Device flow
	 * @returns {Promise<User>} User object.
	 */
	deviceLogin = async (onDeviceCode = this.authConfig.onDeviceCode) => {
		this.oauthConfig ??= await client.discovery(
			new URL(this.authConfig.serverUrl ?? "https://auth.floatplane.com/realms/floatplane"),
			this.authConfig.clientId,
			this.authConfig.clientSecret
		);

		if (!this.authToken) {
			const response = await client.initiateDeviceAuthorization(this.oauthConfig, { scope: "openid profile email offline_access" });
			await onDeviceCode(response);

			const authToken = await client.pollDeviceAuthorizationGrant(this.oauthConfig, response);

			if (authToken.access_token === undefined) throw new Error("No access token received from device authorization flow!");

			this.authToken = authToken;
			this.authToken.expires_at = authToken.expires_in ? new Date(Date.now() + authToken.expires_in * 1000) : undefined;
		}

		await this.refreshAuthToken();

		return this.user.self();
	};

	private login = this.deviceLogin;

	/**
	 * Returns true if authenticated or Error if not.
	 */
	isAuthenticated = async (): Promise<Error | true> =>
		this.user
			.self()
			.then((): true => true)
			.catch((err: Error) => err);
}
