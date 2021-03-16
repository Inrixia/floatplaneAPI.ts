import Core from "../Core";
import { SubscriptionPlan } from "../lib/types";

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
		subscriptions: "https://www.floatplane.com/api/v2/user/subscriptions"
	}

	/**
	 * Fetch subscriptions for the logged in user.
	 * @returns {Promise<Array<Subscription>>} Array of subscription objects.
	*/
	subscriptions = async (): Promise<Array<Subscription>> => JSON.parse(await this.got(this.endpoints.subscriptions, { resolveBodyOnly: true }))
}