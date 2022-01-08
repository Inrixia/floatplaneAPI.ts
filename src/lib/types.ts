export type Image = {
	width: number;
	height: number;
	path: string;
	childImages: ChildImage[];
};

export type ChildImage = { width: number; height: number; path: string };

export type FloatplaneUser = {
	id: string;
	username: string;
	profileImage: Image;
	email: string;
	displayName: string;
	creators: string[];
	isSpoofed?: boolean;
	isAdministrator?: boolean;
	isModerator?: boolean;
	isGlobalModerator?: boolean;
	moderatorCreators?: string[];
};

export type Metadata = {
	hasVideo: boolean;
	videoCount: number;
	videoDuration: number;
	hasAudio: boolean;
	audioCount: number;
	audioDuration: number;
	hasPicture: boolean;
	pictureCount: number;
	hasGallery: boolean;
	galleryCount: number;
	isFeatured: boolean;
};

export type Edge = {
	hostname: string;
	queryPort: number;
	bandwidth: number;
	allowDownload: boolean;
	allowStreaming: boolean;
	datacenter: {
		countryCode: string;
		regionCode: string;
		latitude: number;
		longitude: number;
	};
};

export type Client = {
	ip?: string;
	country_code?: string;
	country_name?: string;
	region_code?: string;
	region_name?: string;
	city?: string;
	zip_code?: string;
	time_zone?: string;
	latitude?: number;
	longitude?: number;
	metro_code?: number;
};

export type SubscriptionPlan = {
	id: string;
	title: string;
	description: string;
	price: string;
	priceYearly: string | null;
	currency: string;
	logo: Image | null;
	interval: string;
	featured: boolean;
	allowGrandfatheredAccess: boolean;
	discordServers: string[];
	discordRoles: string[];
};

export type CreatorObj = {
	id: string;
	owner: {
		id: string;
		username: string;
	};
	title: string;
	urlname: string;
	description: string;
	about: string;
	category: {
		title: string;
	};
	cover: Image;
	icon: Image;
	liveStream: {
		id: string;
		title: string;
		description: string;
		thumbnail: Image;
		owner: string;
		streamPath: string;
		offline: {
			title: string;
			description: string;
			thumbnail: Image;
		};
	};
	subscriptionPlans: SubscriptionPlan[];
	discoverable: boolean;
	subscriberCountDisplay: string;
	incomeDisplay: boolean;
	card: Image;
};
