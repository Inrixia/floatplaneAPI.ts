/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar } from "tough-cookie";
import { expect } from "vitest";

import { headers } from "../index.js";

import type { components } from "./apiSchema.js";
import type { ValueOfA } from "@inrixia/helpers/ts/index.js";

export const gotExtends = () => ({
	cookieJar: new CookieJar(new FileCookieStore("./cookieStore.json")),
	headers,
});
export const BaseUrl = "https://www.floatplane.com";

// // Cheat for custom matchers in typescript
export const matchers: Record<keyof Matchers, Function> = {
	typeOrNull(received: any, argument: any) {
		if (received === null) return OK;
		expect(received).toStrictEqual(expect.any(argument));
		return OK;
	},
	typeOrUndefined(received: any, argument: any) {
		if (received === undefined) return OK;
		expect(received).toStrictEqual(expect.any(argument));
		return OK;
	},
	objectContainingOrEmpty(received: any, argument: any) {
		if (Object.keys(received).length === 0) return OK;
		expect(received).toStrictEqual(expect.objectContaining(argument));
		return OK;
	},
	objectContainingOrUndefined(received: any, argument: any) {
		if (received === undefined) return OK;
		expect(received).toStrictEqual(expect.objectContaining(argument));
		return OK;
	},
	objectContainingOrEmptyOrUndefined(received: any, argument: any) {
		if (received === undefined || Object.keys(received).length === 0) return OK;
		expect(received).toStrictEqual(expect.objectContaining(argument));
		return OK;
	},
	keylessObjectContaining(received: Record<string, any>, argument: any) {
		for (const key in received) {
			expect(received[key]).toStrictEqual(argument);
		}
		return OK;
	},
	arrayContainingOrEmpty<T>(received: any, argument: any[]) {
		if (received.length === 0) return OK;
		expect(received).toStrictEqual(expect.arrayContaining(argument));
		return OK;
	},
	arrayContainingOrEmptyOrUndefined(received: any, argument: any[]) {
		if (received === undefined || received.length === 0) return OK;
		expect(received).toStrictEqual(expect.arrayContaining(argument));
		return OK;
	},
	enum(received: any, argument: any[]) {
		expect(argument).toContain(received);
		return OK;
	},
};
type Primitives = StringConstructor | NumberConstructor | BooleanConstructor;
type Matchers = {
	typeOrNull: <T extends Primitives>(matcher: T) => Primitive<T> | null;
	typeOrUndefined: <T extends Primitives>(matcher: T) => Primitive<T> | undefined;
	objectContainingOrEmpty: <T>(matcher: T) => T | {};
	objectContainingOrUndefined: <T>(matcher: T) => T | undefined;
	objectContainingOrEmptyOrUndefined: <T>(matcher: T) => T | {} | undefined;
	keylessObjectContaining: <T>(matcher: T) => Record<string, T>;
	arrayContainingOrEmpty: <T>(matcher: [T]) => T[] | [];
	arrayContainingOrEmptyOrUndefined: <T>(matcher: [T]) => T[] | [] | undefined;
	enum: <T extends readonly unknown[]>(matcher: T) => ValueOfA<T>;
};
const OK = {
	message: () => "Ok",
	pass: true,
};
const extend = <T extends Vi.ExpectStatic>(matchers: any): T & Matchers => {
	expect.extend(<any>matchers);
	return <T & Matchers>expect;
};
export const eExpect = extend(matchers);

export const metadataFormat: components["schemas"]["PostMetadataModel"] = {
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

export type Image = components["schemas"]["ImageModel"];
type ChildImage = components["schemas"]["ChildImageModel"];

const childImage: ChildImage = {
	width: expect.any(Number),
	height: expect.any(Number),
	path: expect.any(String),
};
export const imageFormat: Image = {
	width: expect.any(Number),
	height: expect.any(Number),
	path: expect.any(String),
	childImages: eExpect.arrayContainingOrEmpty([childImage]),
};

type Client = components["schemas"]["EdgesModel"]["client"];

export const clientFormat: Client = eExpect.objectContainingOrEmpty({
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
export type Edge = components["schemas"]["EdgeModel"];
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

const discordServer: components["schemas"]["DiscordServerModel"] = {
	id: expect.any(String),
	guildName: expect.any(String),
	guildIcon: expect.any(String),
	inviteLink: expect.any(String),
	inviteMode: expect.any(String),
};
const discordRole: components["schemas"]["DiscordRoleModel"] = {
	server: expect.any(String),
	roleName: expect.any(String),
};
export const subscriptionPlan: components["schemas"]["SubscriptionPlanModel"] = {
	id: expect.any(String),
	title: expect.any(String),
	description: expect.any(String),
	discordRoles: eExpect.arrayContainingOrEmpty([discordRole]),
	discordServers: eExpect.arrayContainingOrEmpty([discordServer]),
	featured: expect.any(Boolean),
	price: expect.any(String),
	priceYearly: eExpect.typeOrNull(String),
	currency: expect.any(String),
	logo: eExpect.typeOrNull(String),
	interval: expect.any(String),
	allowGrandfatheredAccess: expect.any(Boolean),
};

export const socialLinks: components["schemas"]["SocialLinksModel"] = {
	instagram: expect.any(String),
	twitter: expect.any(String),
	website: expect.any(String),
	facebook: expect.any(String),
	youtube: expect.any(String),
};

export const creatorObjFormat: components["schemas"]["BlogPostModelV3"]["creator"] = {
	id: expect.any(String),
	owner: expect.objectContaining({
		id: expect.any(String),
		username: expect.any(String),
	}),
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
	subscriptionPlans: expect.arrayContaining([subscriptionPlan]),
	discoverable: expect.any(Boolean),
	subscriberCountDisplay: expect.any(String),
	incomeDisplay: expect.any(Boolean),
	card: eExpect.objectContainingOrUndefined(imageFormat),
};
