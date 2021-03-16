export type Image = {
	width: number;
	height: number;
	path: string;
	childImages: ChildImage[];
};

export type ChildImage = { width: number; height: number; path: string };

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
}

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
	discordServers: Array<string>;
	discordRoles: Array<string>;
}

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
	subscriptionPlans: Array<SubscriptionPlan>;
	discoverable: boolean;
	subscriberCountDisplay: string;
	incomeDisplay: boolean;
	card: Image;
};
