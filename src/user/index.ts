import Core from "../Core";

export type Subscription = {
	startDate: string,
	endDate: string,
	paymentID: number,
	interval: string,
	paymentCancelled: boolean,
	plan: {
		id: string,
		title: string,
		description: string,
		price: string,
		priceYearly: (string|null),
		currency: string,
		logo: (string|null),
		interval: string,
		featured: boolean,
		allowGrandfatheredAccess: boolean
	},
	creator: string
}
export default class User extends Core {
	endpoints = {
		subscriptions: "https://www.floatplane.com/api/user/subscriptions"
	}

	/**
	 * Fetch subscriptions for the logged in user.
	 * @returns {Promise<Array<Subscription>>} Array of subscription objects.
	*/
	subscriptions = async (): Promise<Array<Subscription>> => JSON.parse(
		(await this.got(this.endpoints.subscriptions)).body
	)
}