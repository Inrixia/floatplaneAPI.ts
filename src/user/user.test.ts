import got from "got";
import User from ".";
import { prepCookieJar } from "../lib/testHelpers";

import type { Subscription, Plan } from "./";
export const planFormat: Plan = {
	id: expect.any(String),
	title: expect.any(String),
	description: expect.any(String),
	discordRoles: expect.any(Array), 
	discordServers: expect.any(Array),
	featured: expect.any(Boolean),
	price: expect.any(String),
	priceYearly: null,
	currency: expect.any(String),
	logo: null,
	interval: expect.any(String),
	allowGrandfatheredAccess: expect.any(Boolean)
};
export const subscriptionFormat: Subscription = {
	startDate: expect.any(String),
	endDate: expect.any(String),
	paymentID: expect.any(Number),
	interval: expect.any(String),
	paymentCancelled: expect.any(Boolean),
	plan: planFormat,
	creator: expect.any(String)
};

test("User.subscriptions()", async () => {
	const user = new User(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(user.subscriptions()).resolves.toStrictEqual(expect.arrayContaining<Subscription>([subscriptionFormat]));
});