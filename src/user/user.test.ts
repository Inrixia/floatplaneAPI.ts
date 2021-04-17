import got from "got";
import User from ".";
import { floatplaneUserFormat, gotExtends, subscriptionPlan } from "../lib/testHelpers";

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

const user = new User(got.extend(gotExtends()));
test("User.subscriptions()", () => {
	return expect(user.subscriptions()).resolves.toStrictEqual(expect.arrayContaining<Subscription>([subscriptionFormat]));
});

test("User.self()", () => {
	return expect(user.self()).resolves.toStrictEqual(floatplaneUserFormat);
});