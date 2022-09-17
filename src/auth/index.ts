import { Core } from "../Core.js";
import { BaseUrl } from "../lib/testHelpers.js";

import { type components, ApiPaths } from "../lib/apiSchema.js";

type Login = components["schemas"]["AuthLoginV2Response"];
type LoginRequest = components["schemas"]["AuthLoginV2Request"];
type CheckFor2faLoginRequest = components["schemas"]["CheckFor2faLoginRequest"];

export interface LoginSuccess extends Login {
	user: Login["user"];
	needs2FA: false;
}
export interface Needs2FA extends Omit<Login, "user"> {
	needs2FA: true;
}
export type LoginResponse = Promise<LoginSuccess | Needs2FA>;

export class Auth extends Core {
	/**
	 * Login to floatplane using provided credentials.
	 */
	login = (username: string, password: string, captchaToken?: string): Promise<LoginResponse> =>
		this.got
			.post(BaseUrl + ApiPaths.login, {
				method: "POST",
				json: <LoginRequest>{ username, password, captchaToken },
			})
			.json<LoginResponse>();

	/**
	 * Login using provided 2Factor token.
	 */
	factor = (token: string): Promise<LoginSuccess> =>
		this.got
			.post(BaseUrl + ApiPaths.checkFor2faLogin, {
				method: "POST",
				json: <CheckFor2faLoginRequest>{ token: token.toString() },
			})
			.json<LoginSuccess>();
}
