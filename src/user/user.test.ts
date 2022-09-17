import { expect, test } from "vitest";

import got from "got";
import { User } from "./index.js";
import { imageFormat, eExpect, gotExtends, subscriptionPlan } from "../lib/testHelpers.js";

import type { UserSubscription } from "./index.js";

export const subscriptionFormat: UserSubscription = {
	startDate: expect.any(String),
	endDate: expect.any(String),
	paymentID: expect.any(Number),
	interval: expect.any(String),
	paymentCancelled: expect.any(Boolean),
	plan: subscriptionPlan,
	creator: expect.any(String),
};

export const floatplaneUserSelfFormat = {
	id: expect.any(String),
	username: expect.any(String),
	profileImage: imageFormat,
	email: expect.any(String),
	displayName: expect.any(String),
	creators: eExpect.arrayContainingOrEmpty([String]),
};

const user = new User(got.extend(gotExtends()));
test("User.subscriptions()", () => {
	return expect(user.subscriptions()).resolves.toStrictEqual(expect.arrayContaining<UserSubscription>([subscriptionFormat]));
});

test("User.self()", () => {
	return expect(user.self()).resolves.toStrictEqual(floatplaneUserSelfFormat);
});
