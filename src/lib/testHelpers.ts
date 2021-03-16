import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar } from "tough-cookie";

export const prepCookieJar = async (): Promise<CookieJar> => new CookieJar(new FileCookieStore("./cookieStore.json"));

import type { Image, ChildImage, CreatorObj, SubscriptionPlan } from "./types";

// Cheat for custom matchers in typescript
export const eExpect: any = Object.assign(expect);
eExpect.extend({
	toBeTypeOrNull(received: any, argument: any) {
		if (received === null || expect(received).toEqual(expect.any(argument)) === undefined) return {
			message: () => "Ok",
			pass: true,
		};
	},
	arrayContainingOrEmpty<T>(received: any, argument: Array<T>) {
		if (received.length === 0 || expect(received).toEqual(expect.arrayContaining(argument)) === undefined) return {
			message: () => "Ok",
			pass: true,
		};
	}
});

export const imageFormat: Image = {
	width: expect.any(Number),
	height: expect.any(Number),
	path: expect.any(String),
	childImages: expect.arrayContaining<ChildImage>([
		expect.objectContaining<ChildImage>({
			width: expect.any(Number),
			height: expect.any(Number),
			path: expect.any(String),
		}),
	]),
};

export const subscriptionPlan: SubscriptionPlan = {
	id: expect.any(String),
	title: expect.any(String),
	description: expect.any(String),
	discordRoles: expect.any(Array), 
	discordServers: expect.any(Array),
	featured: expect.any(Boolean),
	price: expect.any(String),
	priceYearly: eExpect.toBeTypeOrNull(String),
	currency: expect.any(String),
	logo: eExpect.toBeTypeOrNull(imageFormat),
	interval: expect.any(String),
	allowGrandfatheredAccess: expect.any(Boolean)
};

export const creatorObjFormat: CreatorObj = {
	id: expect.any(String),
	owner: {
		id: expect.any(String),
		username: expect.any(String),
	},
	title: expect.any(String),
	urlname: expect.any(String),
	description: expect.any(String),
	about: expect.any(String),
	category: {
		title: expect.any(String),
	},
	cover: imageFormat,
	icon: imageFormat,
	liveStream: {
		id: expect.any(String),
		title: expect.any(String),
		description: expect.any(String),
		thumbnail: imageFormat,
		owner: expect.any(String),
		streamPath: expect.any(String),
		offline: {
			title: expect.any(String),
			description: expect.any(String),
			thumbnail: imageFormat,
		},
	},
	subscriptionPlans: expect.arrayContaining<SubscriptionPlan>([subscriptionPlan]),
	discoverable: expect.any(Boolean),
	subscriberCountDisplay: expect.any(String),
	incomeDisplay: expect.any(Boolean),
	card: imageFormat,
};
