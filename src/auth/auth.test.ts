import { toMatchFormat } from "@inrixia/helpers/jest";
expect.extend({ toMatchFormat });

import got from "got";
import { CookieJar } from "tough-cookie";

import Auth from ".";
import type { LoginSuccessResponse, Needs2FA } from "./";

import { username, password, token } from "../lib/credentials.json";



export const factorFormat: Needs2FA = { needs2FA: true };

import { imageFormat } from "../lib/testHelpers";
export const loginSuccessResponse: LoginSuccessResponse = {
	user: {
		id: expect.any(String),
		username: expect.any(String),
		profileImage: imageFormat
	},
	needs2FA: false
};

const auth = new Auth(got.extend({ cookieJar: new CookieJar() }));

// NOTE: This test assumes that the account used for testing has 2Factor authentication enabled!
test("Auth.login(username, password)", () => {
	return expect(auth.login(username, password)).resolves.toMatchObject<Needs2FA>(factorFormat);
});

test("Auth.factor(token)", () => {
	return expect(auth.factor(token)).resolves.toMatchObject<LoginSuccessResponse>(loginSuccessResponse);
});