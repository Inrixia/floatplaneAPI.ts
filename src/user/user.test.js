const { childrenToMatchFormat } = require("@inrixia/helpers/jest");

const user = new (require("./"))(require("got").extend({ mutableDefaults: true }));
user.cookie = (new (require("@inrixia/db"))("credentials", "./credentials.json", false)).cookie;

const subscriptionFormat = {
	startDate: "string",
	endDate: "string",
	paymentID: "number",
	interval: "string",
	paymentCancelled: "boolean",
	plan: {
		id: "string",
		title: "string",
		description: "string",
		price: "string",
		priceYearly: ["null", "string"],
		currency: "string",
		logo: ["null", "string"],
		interval: "string",
		featured: "boolean",
		allowGrandfatheredAccess: "boolean"
	},
	creator: "string"
};

expect.extend({ childrenToMatchFormat });

test("subscriptions", () => expect(user.subscriptions()).resolves.childrenToMatchFormat(subscriptionFormat));