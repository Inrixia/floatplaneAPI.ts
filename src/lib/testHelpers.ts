import { expect as exp } from "vitest";

import { getExpect, type EExpect } from "@inrixia/helpers/test";

export const expect: EExpect<typeof exp> = getExpect(exp);

import type { components } from "./apiSchema.js";
import type { BlogPost } from "../creator.js";

export * from "./helpers.js";

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

export const liveStreamModelFormat: components["schemas"]["LiveStreamModel"] = {
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
};

export const creatorModelV3Format: components["schemas"]["BlogPostModelV3"]["creator"] = {
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
		id: expect.any(String),
		title: expect.any(String),
	},
	cover: imageFormat,
	icon: imageFormat,
	liveStream: liveStreamModelFormat,
	subscriptionPlans: expect.arrayContaining([subscriptionPlan]),
	discoverable: expect.any(Boolean),
	subscriberCountDisplay: expect.any(String),
	incomeDisplay: expect.any(Boolean),
	card: expect.objectContainingOrNull(imageFormat),
};
export const channelFormat: components["schemas"]["ChannelModel"] = {
	id: expect.any(String),
	creator: expect.any(String),
	title: expect.any(String),
	urlname: expect.any(String),
	about: expect.any(String),
	order: expect.typeOrUndefined(Number),
	cover: expect.objectContainingOrNull(imageFormat),
	card: expect.objectContainingOrNull(imageFormat),
	icon: expect.objectContaining(imageFormat),
	socialLinks: expect.anything(),
};
export const blogPostFormat: BlogPost = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	tags: expect.arrayContainingOrEmpty([expect.any(String)]),
	text: expect.any(String),
	type: expect.stringMatching("blogPost"),
	channel: expect.objectContaining(channelFormat),
	attachmentOrder: expect.arrayContaining([expect.any(String)]),
	metadata: metadataFormat,
	releaseDate: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	comments: expect.any(Number),
	creator: creatorModelV3Format,
	isAccessible: expect.any(Boolean),
	thumbnail: expect.objectContainingOrNull(imageFormat),
	videoAttachments: expect.arrayContainingOrEmpty([expect.any(String)]),
	audioAttachments: expect.arrayContainingOrEmpty([expect.any(String)]),
	pictureAttachments: expect.arrayContainingOrEmpty([expect.any(String)]),
	galleryAttachments: expect.arrayContainingOrEmpty([expect.any(String)]),
	wasReleasedSilently: expect.any(Boolean),
};

export const creatorModelV2Format: components["schemas"]["CreatorModelV2"] = {
	id: expect.any(String),
	owner: expect.any(String),
	title: expect.any(String),
	urlname: expect.any(String),
	description: expect.any(String),
	about: expect.any(String),
	category: expect.any(String),
	cover: expect.typeOrNull(imageFormat),
	icon: imageFormat,
	liveStream: expect.typeOrNull(liveStreamModelFormat),
	// TODO: Detemine if this should be properly populated
	subscriptionPlans: expect.anything(),
	discoverable: expect.any(Boolean),
	subscriberCountDisplay: expect.any(String),
	incomeDisplay: expect.any(Boolean),
};

export const videoAttachmentModelFormat: components["schemas"]["VideoAttachmentModel"] = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	type: expect.any(String),
	description: expect.any(String),
	releaseDate: expect.typeOrNull(String),
	duration: expect.any(Number),
	creator: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	isProcessing: expect.any(Boolean),
	primaryBlogPost: expect.any(String),
	thumbnail: imageFormat,
	isAccessible: expect.any(Boolean),
};
export const pictureAttachmentModelFormat: components["schemas"]["PictureAttachmentModel"] = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	type: expect.any(String),
	description: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	isProcessing: expect.any(Boolean),
	creator: expect.any(String),
	primaryBlogPost: expect.any(String),
	thumbnail: imageFormat,
	isAccessible: expect.any(Boolean),
};
export const audioAttachmentModelFormat: components["schemas"]["AudioAttachmentModel"] = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	type: expect.any(String),
	description: expect.any(String),
	duration: expect.any(Number),
	waveform: {
		dataSetLength: expect.any(Number),
		highestValue: expect.any(Number),
		lowestValue: expect.any(Number),
		data: expect.arrayContaining([expect.any(Number)]),
	},
	creator: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	isProcessing: expect.any(Boolean),
	primaryBlogPost: expect.any(String),
	isAccessible: expect.any(Boolean),
};

export const contentPostFormat: components["schemas"]["ContentPostV3Response"] = {
	...blogPostFormat,
	userInteraction: expect.arrayContainingOrEmpty([expect.stringMatching(/like|dislike/)]),
	creator: creatorModelV2Format,
	videoAttachments: expect.arrayContainingOrEmpty([videoAttachmentModelFormat]),
	audioAttachments: expect.arrayContainingOrEmpty([audioAttachmentModelFormat]),
	pictureAttachments: expect.arrayContainingOrEmpty([pictureAttachmentModelFormat]),
	galleryAttachments: expect.anything(),
};
