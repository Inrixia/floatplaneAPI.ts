import Core from "../Core";
import { FloatplaneUser, SubscriptionPlan } from "../lib/types";

export type Subscription = {
	startDate: string,
	endDate: string,
	paymentID: number,
	interval: string,
	paymentCancelled: boolean,
	plan: SubscriptionPlan,
	creator: string
}

export default class User extends Core {
	endpoints = {
		subscriptions: "https://www.floatplane.com/api/v3/user/subscriptions",
		self: "https://www.floatplane.com/api/v3/user/self"
	}

	/**
	 * Fetch subscriptions for the logged in user.
	*/
	subscriptions = async (): Promise<Array<Subscription>> => await this.got(this.endpoints.subscriptions, { resolveBodyOnly: true }).then(JSON.parse)

	/**
	 * Fetch information about the logged in user.
	*/
	self = async (): Promise<FloatplaneUser> => await this.got(this.endpoints.self, { resolveBodyOnly: true }).then(JSON.parse)
}