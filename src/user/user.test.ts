import got from "got";
import User from ".";
import { floatplaneUserFormat, prepCookieJar, subscriptionPlan } from "../lib/testHelpers";

import type { Subscription } from "./";

export const subscriptionFormat: Subscription = {
	startDate: expect.any(String),
	endDate: expect.any(String),
	paymentID: expect.any(Number),
	interval: expect.any(String),
	paymentCancelled: expect.any(Boolean),
	plan: subscriptionPlan,
	creator: expect.any(String)
};

test("User.subscriptions()", async () => {
	const user = new User(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(user.subscriptions()).resolves.toStrictEqual(expect.arrayContaining<Subscription>([subscriptionFormat]));
});

test("User.self()", async () => {
	const user = new User(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(user.self()).resolves.toStrictEqual(floatplaneUserFormat);
});