# Unofficial Floatplane API

This library is not in any way related to LMG or Floatplane Media Inc.

Features/Endpoints are added as needed so if something is missing please make a [Issue](https://github.com/Inrixia/floatplaneAPI.ts/issues/new) or [Pull Request](https://github.com/Inrixia/floatplaneAPI.ts/pulls)

# Install

`$ npm install floatplane`

Individual classes can be imported seperately:

```ts
import { Auth } from "floatplane/auth";
```

# Usage

```ts
import { Floatplane } from "floatplane";

const floatplane = new Floatplane(); // Create a new API instance.

(async () => {
	// Run with async/await
	const login = await floatplane.login({
		username: "yourUsername",
		password: "yourPassword",
		token: "yourTokenIfYouUse2Factor",
	});
	// login -> User object
	const subs = await floatplane.user.subscriptions();
	// subs -> User subscriptions
	const videos = await floatplane.creator.blogPosts(subs[0].creator, { type: "video" });
	// videos -> 20 Latest videos from first subscription

	console.log(videos);
})().catch(console.log); // Errors are logged to console
```

# Floatplane API

### [Login](#floatplane_login)

### [isAuthenticated](#floatplane_isAuthenticated)

## Modules

Each module has a object containing endpoints used. Purely<br>
Ex: floatplane.<a name="auth">auth</a>.endpoints.login is the url of the `login` endpoint.<br>
<br>

### [Auth](#_auth)

- [.login(username, password)](#auth_login)<br>
- [.factor(token)](#auth_factor)<br>

### [Api](#_api)

- [.edges()](#api_edges)

### [Creator](#_creator)

- [.blogPosts(creatorGUID, options)](#creator_blogPosts)<br>
- [.blogPostsIterable(creatorGUID, options)](#creator_blogPostsIterable)

### [User](#_user)

- [.subscriptions()](#user_subscriptions)
- [.self()](#user_self)

### [CDN](#_cdn)

- [.delivery(type, id)](#cdn_delivery)<br>

## [Types](#types)

<br>

# General Use

### <b>floatplane.<a name="floatplane_login">login</a></b>(options): Promise\<[User](#user_type)>

Login to floatplane so future requests are authenticated. Purely a wrapper around Floatplane.auth.login & Floatplane.auth.factor to simplify things.<br><br>

<b>options.username</b>: `string`<br>
Username to use when logging in.

<b>options.password</b>: `string`<br>
Password to use when logging in.

<b>captchaToken</b>?: `string`<br>
Recaptcha token. Not required.
Get a single use captchaToken by going to floatplane.com/login and running this in console:

```ts
grecaptcha.execute("6LfwnJ0aAAAAANTkEF2M1LfdKx2OpWAxPtiHISqr", { action: "login" }).then(console.log);
```

<b>options.token</b>?: `string` | `undefined`<br>
2 Factor authentication token to use when logging in. Only needed if your account has 2 factor enabled.
<br>
<br>

### Example:

```ts
const user = await floatplane.login({
	username: "yourUsername",
	password: "yourPassword",
	token: "yourTokenIfYouUse2Factor",
});
```

<br>

### <b>floatplane.[isAuthenticated](#floatplane_isAuthenticated)</b>(): Promise\<`true` | `Error`>

Returns promise of true if authenticated or Error if not.<br>
<br>
<br>

## <a name="_auth">Auth</a>

---

### <b>floatplane.[auth](#_auth).<a name="auth_login">login</a></b>(username, password, captchaToken): Promise\<[User](#user_type) | [Needs2fa](#needs2fa_type)>

Login to floatplane. If user requires 2 factor authentication then only `{ needs2FA: true }` will be returned.<br>
<br>

<b>username</b>: `string` <br>
Username to use.

<b>password</b>: `string`<br>
Password to use.

<b>captchaToken</b>?: `string`<br>
Recaptcha token. Not required.
Get a single use captchaToken by going to floatplane.com/login and running this in console:

```ts
grecaptcha.execute("6LfwnJ0aAAAAANTkEF2M1LfdKx2OpWAxPtiHISqr", { action: "login" }).then(console.log);
```

<br>
<br>

### Example:

```ts
const user = await floatplane.auth.login("yourUsername", "yourPassword", "captchaToken");
```

<br>

### <b>floatplane.[auth](#_auth).<a name="auth_factor">factor</a></b>(token): Promise\<[User](#user_type)>

Complete login to floatplane with 2 factor authentication token.<br>
<br>

<b>token</b>: `string`<br>
2 Factor authentication token to use.

### Example:

```ts
const user = await floatplane.auth.factor("your2FactorToken");
```

<br>
<br>

## <a name="_api">Api</a>

---

### <b>floatplane.[api](#_api).<a name="api_edges">edges</a></b>(): Promise\<{ edges: Array<[Edge](#edge_type)>, client: [Client](#client_type) }>

Fetch floatplane api server edges. (Depricated)<br>

### Example:

```ts
const user = await floatplane.api.edges();
```

<br>
<br>

## <a name="_creator">Creator</a>

---

### <b>floatplane.[creator](#_creator).<a name="creator_blogPosts">blogPosts</a></b>(creatorGUID, options?): Promise<Array\<[BlogPost](#blogpost_type)>>

Fetch creator blogPosts, returns a promise of an array of 20 blogPosts.<br>
If you want to easily fetch more than 20 blogPosts check out [blogPostsIterable()](creator_blogPostsIterable) instead.
<br><br>
<b>creatorGUID</b>: `string`<br>
Creator GUID to fetch videos from.
<br><br>

### Options:

<b>options.fetchAfter</b>: `number`<br>
Number of videos from the latest to fetch from.

<b>options.type</b>: `"audio" | "video" | "picture" | "gallery"`<br>
Filter BlogPosts by attachment types. Can be "audio", "video", "picture" or "gallery".

<b>options.sort</b>: `string`<br>
Sort by releaseDate. Can be "DESC" or "ASC".

<b>options.search</b>: `"ASC" | "DESC"`<br>
Filter BlogPosts by search term.

<b>options.limit</b>: `number`<br>
Max amount of BlogPosts to return. Must be in range 1-20.
<br><br>

### Examples:

```ts
const videos = await floatplane.creator.blogPosts("creatorGUID", { type: "video" }); // Array of 20 videos
```

<br>

### <b>floatplane.[creator](#_creator).<a name="creator_blogPostsIterable">blogPostsIterable</a></b>(creatorGUID, options?): AsyncIterator\<[Video](#video_type)>

Fetch creator videos. Returns a async iterator that will return all blogPosts from the specified creator.<br>
BlogPosts are fetched in batches of 20 but returned individually.<br><br>
Creator GUID to fetch videos from.<br>
<b>creatorGUID</b>: `string`
<br><br>

### Options:

Filter BlogPosts by attachment types. Can be "audio", "video", "picture" or "gallery".<br>
<b>options.type</b>: `"audio" | "video" | "picture" | "gallery"`

Sort by releaseDate. Can be "DESC" or "ASC".<br>
<b>options.sort</b>: `string`

Filter BlogPosts by search term.<br>
<b>options.search</b>: `"ASC" | "DESC"`
<br><br>

### Examples:

```ts
const videos = floatplane.creator.blogPostsIterable("creatorGUID", { type: "video" });
const firstVideo = await videos.next().value; // Fetch one video
```

```ts
for await (const video of floatplane.creator.blogPostsIterable("creatorGUID", { type: "video" })) {
	// Loops over every video from the creator.
}
```

<br>
<br>

## <a name="_user">User</a>

---

### <b>floatplane.[user](#_user).<a name="user_subscriptions">subscriptions</a></b>(): Promise\<Array<[Subscription](#subscription)>>

Fetches subscriptions for current user.<br>

### Example:

```ts
const subscriptions = await floatplane.user.subscriptions();
```

<br>

### <b>floatplane.[user](#_user).<a name="user_self">self</a></b>(): Promise\<FloatplaneUser(#FloatplaneUser)>

Fetch information about the logged in user.<br>

### Example:

```ts
const subscriptions = await floatplane.user.subscriptions();
```

<br>
<br>

## <a name="_cdn">CDN</a>

---

### <b>floatplane.[video](#_video).<a name="cdn_delivery">delivery</a></b>(type, id): Promise\<[LiveDeliveryResponse](#LiveDeliveryResponse_type) | [VodDeliveryResponse](#VodDeliveryResponse_type) | [DownloadDeliveryResponse](#DownloadDeliveryResponse_type)>

Fetches resource information from cdn.<br>

<b>type</b>: `"live" | "vod" | "download"`<br>
Type of resource to fetch info for.

<b>id</b>: `string`<br>
ID of resource.
<br><br>

### Example:

```ts
const liveInfo = await floatplane.cdn.delivery("live", "59f94c0bdd241b70349eb72b");
const vodInfo = await floatplane.cdn.delivery("vod", "InwhyES1dt");
const downloadInfo = await floatplane.cdn.delivery("download", "InwhyES1dt");
```

<br>

## <a name="_got">Got</a>

https://www.npmjs.com/package/got<br>
Got is the http/https library used for handling requests sent to floatplane.<br>
When importing individual classes a `got` instance is required to be passed to their constructor.<br>
In order for requests to be authenticated a single instance of `got` should be used for all classes and got should be extended with `mutableDefaults: true`.

```ts
// You can set default headers here too, check the got docs for more info
import got from "got";
import { Auth } from "floatplane/auth";
import { User } from "floatplane/user";

// Same instance of got used for both constructors so that cookies are shared
const auth = new Auth(got);
const user = new User(got);
```

<br><br>

# <a name="types">Types</a>

<br>

## <a name="LoginSuccess_type">LoginSuccess</a>

Types Used: <a name="Image_type">Image</a>

```ts
type LoginSuccess = {
	user: {
		id: string;
		username: string;
		profileImage: Image;
	};
	needs2FA: false;
};
```

<br>

## <a name="needs2fa">Needs2fa</a>

Types Used: <a name="needs2fa_type">Needs2fa</a>

```ts
type Needs2fa = {
	needs2fa: true;
};
```

<br>

## <a name="Image_type">Image</a>

Types Used: <a name="childImage_type">ChildImage</a>

```ts
type ChildImage = {
	width: number;
	height: number;
	path: string;
	childImages: ChildImage[];
};
```

<br>

## <a name="childImage_type">ChildImage</a>

```ts
type ChildImage = {
	width: number;
	height: number;
	path: string;
};
```

<br>

## <a name="user_type">User</a>

Types Used: <a name="Image_type">Image</a>

```ts
type Image = {
	needs2FA: boolean;
	user: {
		id: string;
		username: string;
		profileImage: {
			width: number;
			height: number;
			path: string;
			childImages: Image[];
		};
	};
};
```

<br>

## <a name="subscriptionplan_type">SubscriptionPlan</a>

Types Used: <a name="Image_type">Image</a>

```ts
type SubscriptionPlan = {
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
```

<br>

## <a name="subscription_type">Subscription</a>

Types Used: <a name="subscriptionplan_type">SubscriptionPlan</a>

```ts
type Subscription = {
	startDate: string;
	endDate: string;
	paymentID: number;
	interval: string;
	paymentCancelled: boolean;
	plan: SubscriptionPlan;
	creator: string;
};
```

<br>

## <a name="CreatorObj_type">CreatorObj</a>

Types Used: <a name="Image_type">Image</a>, <a name="subscriptionplan_type">SubscriptionPlan</a>

```ts
type CreatorObj = {
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
```

<br>

## <a name="metadata_type">Metadata</a>

```ts
type Metadata = {
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
```

<br>

## <a name="blogPost_type">BlogPost</a>

Types Used: <a name="metadata_type">Metadata</a>, <a name="CreatorObj_type">CreatorObj</a>, <a name="Image_type">Image</a>

```ts
type BlogPost = {
	id: string;
	guid: string;
	title: string;
	tags: string[];
	text: string;
	type: string;
	attachmentOrder: string[];
	metadata: Metadata;
	releaseDate: string;
	likes: number;
	dislikes: number;
	score: number;
	comments: number;
	creator: CreatorObj;
	thumbnail: Image;
	isAccessible: boolean;
	videoAttachments: string[];
	audioAttachments: string[];
	pictureAttachments: string[];
	galleryAttachments: string[];
	wasReleasedSilently: boolean;
};
```

<br>

## <a name="edge_type">Edge</a>

```ts
type Edge = {
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
```

<br>

## <a name="client_type">Client</a>

```ts
type Client = {
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
```

<br>

## <a name="qualitylevel_type">QualityLevel</a>

```ts
type QualityLevel = {
	name: string;
	width: number;
	height: number;
	label: string;
	order: number;
};
```

<br>

## <a name="LiveDeliveryResponse_type">LiveDeliveryResponse</a>

```ts
type LiveDeliveryResponse = {
	cdn: string;
	strategy: string;
	resource: {
		// "/api/video/v1/~~.m3u8?token={token}&allow_source=false"
		uri: string;
		data: {
			token: string;
		};
	};
};
```

<br>

## <a name="VodDeliveryResponse_type">VodDeliveryResponse</a>

Types Used: <a name="qualitylevel_type">QualityLevel</a>

```ts
type VodDeliveryResponse = {
	cdn: string;
	strategy: string;
	resource: {
		// "/Videos/~~/{data.qualityLevel.name}.mp4/chunk.m3u8?token={data.qualityLevelParam.token}"
		uri: string;
		data: {
			qualityLevels: QualityLevel[];
			qualityLevelParams: {
				[key: string]: { token: string };
			};
		};
	};
};
```

<br>

## <a name="DownloadDeliveryResponseDeliveryResponse_type">DownloadDeliveryResponseDeliveryResponse</a>

Types Used: <a name="client_type">Client</a>, <a name="qualitylevel_type">QualityLevel</a>, <a name="edge_type">Edge</a>

```ts
type DownloadDeliveryResponseDeliveryResponse = {
	client?: Client;
	edges: Array<Edge>;
	strategy: string;
	resource: {
		// "/Videos/{videoGUID}/{data.qualityLevel.name}.mp4?wmsAuthSign={data.token}"
		uri: string;
		data: {
			qualityLevels: QualityLevel[];
			token: string;
		};
	};
};
```

<br>

## <a name="FloatplaneUser_type">FloatplaneUser</a>

Types Used: <a name="CreatorObj_type">CreatorObj</a>, <a name="Image_type">Image</a>

```ts
export type FloatplaneUser = {
	id: string;
	username: string;
	profileImage: Image;
	email: string;
	displayName: string;
	creators: CreatorObj[];
};
```

<br>

## <a name="SyncEvent_type">SyncEvent</a>

Types Used: <a name="Image_type">Image</a>

```ts
type SyncEvent = CreatorMenuUpdate | PostRelease;

type CreatorMenuUpdate = {
	event: "creatorMenuUpdate";
	id: string;
	guid: string;
	title: string;
	text: string;
	type: string;
	attachmentOrder: string[];
	metadata: Metadata;
	releaseDate: string;
	likes: number;
	dislikes: number;
	score: number;
	comments: number;
	creator: string;
	thumbnail: Image;
};
type PostRelease = {
	event: "postRelease";
	data: {
		id: string;
		message: string;
		url: string;
		title: string;
		post: {
			id: string;
			guid: string;
			title: string;
			text: string;
			type: string;
			attachmentOrder: string[];
			metadata: Metadata;
			releaseDate: string | null;
			likes: number;
			dislikes: number;
			score: number;
			comments: number;
			creator: string;
			thumbnail: Image;
		};
		video: {
			id: string;
			guid: string;
			creator: {
				createdAt: string;
				updatedAt: string;
				id: string;
				urlname: string;
				title: string;
				description: string;
				about: string;
				visibility: string;
				subscriberCountDisplay: string;
				incomeDisplay: boolean;
				discoverable: boolean;
				transcodingPriority: string;
				owner: string;
				category: string;
				iconImage: string;
				coverImage: string;
				cardImage: string;
				liveStream: string;
				customCreatorAgreement: string;
				profileImageUrl: string;
			};
			description: string;
		};
		icon: string;
	};
};
```

<br><br>

## Projects

The following projects use this library:

### [Floatplane Downloader](https://github.com/Inrixia/Floatplane-Downloader)
