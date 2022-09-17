import { Core } from "../Core.js";
import { ApiPaths, components } from "../lib/apiSchema.js";
import { BaseUrl } from "../lib/testHelpers.js";

export type UserSubscription = components["schemas"]["UserSubscriptionModel"];
export type Self = components["schemas"]["UserSelfV3Response"];

export class User extends Core {
	/**
	 * Fetch subscriptions for the logged in user.
	 */
	subscriptions = (): Promise<UserSubscription[]> => this.got(BaseUrl + ApiPaths.listUserSubscriptionsV3).json<UserSubscription[]>();

	/**
	 * Fetch information about the logged in user.
	 */
	self = (): Promise<Self> => this.got(BaseUrl + ApiPaths.getSelf).json<Self>();
}
