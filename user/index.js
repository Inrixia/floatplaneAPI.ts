const Core = require('../core.js')

module.exports = class User extends Core {
	endpoints = {
		subscriptions: "https://www.floatplane.com/api/user/subscriptions"
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
			priceYearly: (string|null),
			currency: string,
			logo: (string|null),
			interval: string,
			featured: boolean,
			allowGrandfatheredAccess: boolean
		},
		creator: string
	}>} Array of subscription objects.
	*/
	subscriptions = async () => this._middleware(await this.got(this.endpoints.subscriptions))
}