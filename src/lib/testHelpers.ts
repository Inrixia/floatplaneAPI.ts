import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar } from "tough-cookie";
import { expect as exp } from "vitest";

import { getExpect, type EExpect } from "@inrixia/helpers/test";

export const expect: EExpect<Vi.ExpectStatic> = getExpect(exp);

import { headers } from "../index.js";

import type { components } from "./apiSchema.js";

export const gotExtends = () => ({
	cookieJar: new CookieJar(new FileCookieStore("./cookieStore.json")),
	headers,
});

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
	childImages: expect.arrayContainingOrEmpty([childImage]),
};

type Client = components["schemas"]["EdgesModel"]["client"];

export const clientFormat: Client = expect.objectContainingOrEmpty({
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
	discordRoles: expect.arrayContainingOrEmpty([discordRole]),
	discordServers: expect.arrayContainingOrEmpty([discordServer]),
	featured: expect.any(Boolean),
	price: expect.any(String),
	priceYearly: expect.typeOrNull(String),
	currency: expect.any(String),
	logo: expect.typeOrNull(String),
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
		thumbnail: expect.objectContainingOrNull(imageFormat),
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
	card: expect.objectContainingOrNull(imageFormat),
};
