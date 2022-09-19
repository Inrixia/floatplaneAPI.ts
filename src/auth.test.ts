import { expect, test } from "vitest";
import got from "got";

import { Auth } from "./auth.js";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { username, password, token } = require("../../credentials.json");

import type { LoginSuccess, Needs2FA } from "./auth.js";
export const factorFormat: Needs2FA = { needs2FA: true };

import { imageFormat, gotExtends } from "./lib/testHelpers.js";
export const loginSuccessFormat: LoginSuccess = {
	user: {
		id: expect.any(String),
		username: expect.any(String),
		profileImage: imageFormat,
	},
	needs2FA: false,
};

const auth = new Auth(got.extend(gotExtends()));

// NOTE: This test assumes that the account used for testing has 2Factor authentication enabled!
test("Auth.login(username, password)", async () => {
	return expect(await auth.login(username, password)).toStrictEqual<Needs2FA>(factorFormat);
});

test("Auth.factor(token)", async () => {
	return expect(await auth.factor(token)).toStrictEqual<LoginSuccess>(loginSuccessFormat);
});
