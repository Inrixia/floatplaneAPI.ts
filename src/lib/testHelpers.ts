/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar } from "tough-cookie";

import { headers } from "../";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const gotExtends = () => ({
	cookieJar: new CookieJar(new FileCookieStore("./cookieStore.json")),
	headers,
});

import type { Image, ChildImage, CreatorObj, SubscriptionPlan, Metadata, Client, Edge } from "./types";

// Cheat for custom matchers in typescript
export const eExpect: any = Object.assign(expect);
const OK = {
	message: () => "Ok",
	pass: true,
};
eExpect.extend({
	toBeTypeOrNull(received: any, argument: any) {
		if (received === null || expect(received).toEqual(expect.any(argument)) === undefined) return OK;
	},
	toBeTypeOrUndefined(received: any, argument: any) {
		if (received === undefined || expect(received).toEqual(expect.any(argument)) === undefined) return OK;
	},
	toBeObjectTypeOrEmpty(received: any, argument: any) {
		if (Object.keys(received).length === 0 || expect(received).toEqual(expect.any(argument)) === undefined) return OK;
	},
	arrayContainingOrEmpty<T>(received: any, argument: Array<T>) {
		if (received.length === 0 || expect(received).toEqual(expect.arrayContaining(argument)) === undefined) return OK;
	},
	arrayContainingOrEmptyOrUndefined<T>(received: any, argument: Array<T>) {
		if (received === undefined || received.length === 0 || expect(received).toEqual(expect.arrayContaining(argument)) === undefined) return OK;
	},
});

export const metadataFormat: Metadata = {
	hasVideo: expect.any(Boolean),
	videoCount: expect.any(Number),
	videoDuration: expect.any(Number),
	hasAudio: expect.any(Boolean),
	audioCount: expect.any(Number),
	audioDuration: expect.any(Number),
	hasPicture: expect.any(Boolean),
	pictureCount: expect.any(Number),
	hasGallery: expect.any(Boolean),
	galleryCount: expect.any(Number),
	isFeatured: expect.any(Boolean),
};

export const imageFormat: Image = expect.objectContaining<Image>({
	width: expect.any(Number),
	height: expect.any(Number),
	path: expect.any(String),
	childImages: eExpect.arrayContainingOrEmpty([
		expect.objectContaining<ChildImage>({
			width: expect.any(Number),
			height: expect.any(Number),
			path: expect.any(String),
		}),
	]),
});

export const floatplaneUserFormat: any = {
	id: expect.any(String),
	username: expect.any(String),
	profileImage: imageFormat,
	email: expect.any(String),
	displayName: expect.any(String),
	creators: eExpect.arrayContainingOrEmpty([String]),
};

export const clientFormat: Client = eExpect.toBeObjectTypeOrEmpty({
	ip: expect.any(String),
	country_code: expect.any(String),
	country_name: expect.any(String),
	region_code: expect.any(String),
	region_name: expect.any(String),
	city: expect.any(String),
	zip_code: expect.any(String),
	time_zone: expect.any(String),
	latitude: expect.any(Number),
	longitude: expect.any(Number),
	metro_code: expect.any(Number),
});
export const edgeFormat: Edge = {
	hostname: expect.any(String),
	queryPort: expect.any(Number),
	bandwidth: expect.any(Number),
	allowDownload: expect.any(Boolean),
	allowStreaming: expect.any(Boolean),
	datacenter: {
		countryCode: expect.any(String),
		regionCode: expect.any(String),
		latitude: expect.any(Number),
		longitude: expect.any(Number),
	},
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
	allowGrandfatheredAccess: expect.any(Boolean),
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
