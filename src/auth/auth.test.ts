import got from "got";

import Auth from ".";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { username, password, captchaToken, token } = require("../../credentials.json");

import type { LoginSuccess, Needs2FA } from "./";
export const factorFormat: Needs2FA = { needs2FA: true };

import { imageFormat, prepCookieJar } from "../lib/testHelpers";
export const loginSuccessResponse: LoginSuccess = {
	user: {
		id: expect.any(String),
		username: expect.any(String),
		profileImage: imageFormat
	},
	needs2FA: false
};

let auth: Auth;
beforeAll(async () => auth = new Auth(got.extend({ cookieJar: await prepCookieJar() })));
	
// NOTE: This test assumes that the account used for testing has 2Factor authentication enabled!
test("Auth.login(username, password)", () => {
	return expect(auth.login(username, password, captchaToken)).resolves.toStrictEqual<Needs2FA>(factorFormat);
});

test("Auth.factor(token)", () => {
	return expect(auth.factor(token)).resolves.toStrictEqual<LoginSuccess>(loginSuccessResponse);
});