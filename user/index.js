module.exports = class User {
	endpoints = {
		subscriptions: "https://www.floatplane.com/api/user/subscriptions"
	}	
	constructor(got) {
		this.got = got
	}

	/**
	 * Fetch subscriptions for the logged in user.
	 * @returns {Array<{
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
			priceYearly: string,
			currency: string,
			logo: string,
			interval: string,
			featured: boolean,
			allowGrandfatheredAccess: boolean
		},
		creator: string
	}>} Array of subscription objects.
	*/
	subscriptions = async () => JSON.parse((await this.got(this.endpoints.subscriptions)).body)
}