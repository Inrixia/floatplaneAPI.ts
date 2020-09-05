# Unofficial Floatplane API
This library is not in any way related to LMG or Floatplane Media Inc.

Features/Endpoints are added as needed so if something is missing please make a [Issue](https://github.com/Inrixia/floatplaneAPI.js/issues/new) or [Pull Request](https://github.com/Inrixia/floatplaneAPI.js/pulls)

# Install
```$ npm install floatplane```

Individual classes can be imported seperately:
```js 
require('floatplane/auth')
``` 

# Usage
```js
const Floatplane = require("floatplane");

const floatplane = new Floatplane(); // Create a new API instance.

;(async () => { // Run with async/await
	const login = await floatplane.login({
		username: "yourUsername",
		password: "yourPassword",
		token: "yourTokenIfYouUse2Factor"
	})
	// login -> User object
	const subs = await floatplane.user.subscriptions()
	// subs -> User subscriptions
	const videos = await floatplane.creator.videos(subs[0].creator)
	// videos -> 20 Latest videos from first subscription
})().catch(console.log) // Errors are logged to console
```

# Floatplane API
#### [Login](#login)

### [Auth](#_auth)
> [login](#auth_login)<br>
> [factor](#auth_factor)
### [Api](#_api)
> [edges](#api_edges)
### [Creator](#_creator)
> [videos](#creator_videos)<br>
> [videosIterable](#creator_videosIterable)
### [User](#_user)
> [subscriptions](#user_subscriptions)
### [Video](#_video)
> [downloadURL](#video_downloadURL)<br>
> [download](#video_download)
<br>

## Types
>### [User](#user_type)
>### [Video](#video_type)
>### [Edges](#edges_type)
>### [Subscription](#subscription_type)
<br>
<br>

# API
### floatplane.<a name="login">login</a>([options](#login_options)): Promise\<[User](#user_type)>
Login to floatplane so future requests are authenticated. Purely a wrapper around Floatplane.auth.login & Floatplane.auth.factor to simplify things.<br>

#### <a name=login_options>options</a>.username:`string`
Username to use when logging in.
#### options.password:`string`
Password to use when logging in.
#### options.token:`string`? = `undefined`
2 Factor authentication token to use when logging in. Only needed if your account has 2 factor enabled.

### Example:
```js
const user = await floatplane.login({
	username: "yourUsername",
	password: "yourPassword",
	token: "yourTokenIfYouUse2Factor"
})
```
<br>
<br>

## <a name="_auth">Auth</a>
---
### floatplane.[auth](#_auth).<a name="auth_login">login</a>([username](#username), [password](#password)): Promise\<[User](#user_type)>
Login to floatplane. If user requires 2 factor authentication then only `{ needs2FA: true }` will be returned.<br>

#### <a name="username">username</a>:`string` 
Username to use.
#### <a name="password">password</a>:`string` 
Password to use.

### Example:
```js
const user = await floatplane.auth.login("yourUsername", "yourPassword")
```
<br>

### floatplane.[auth](#_auth).<a name="auth_factor">factor</a>([token](#token)): Promise\<[User](#user_type)>
Complete login to floatplane with 2 factor authentication token.<br>

<a name="token">token</a>:`string`
2 Factor authentication token to use.

### Example:
```js
const user = await floatplane.auth.factor("your2FactorToken")
```
<br>
<br>

## <a name="_api">Api</a>
---
### floatplane.[api](#_api).<a name="api_edges">edges</a>(): Promise\<[Edges](#edges_type)>
Fetch floatplane api server edges.<br>

### Example:
```js
const user = await floatplane.api.edges()
```
<br>
<br>

## <a name="_creator">Creator</a>
---
### floatplane.[creator](#_creator).<a name="creator_videos">videos</a>([creatorGUID](#creatorGUID), [fetchAfter](#fetchAfter)?): Promise<Array\<[Video](#video_type)>>
Fetch creator videos starting from `fetchAfter` number of videos if specified. Returns an array of 20 videos.<br>
If you want to fetch more than 20 videos its best to use [videosIterable()](creator_videosIterable) instead.<br>

#### <a name="creatorGUID">creatorGUID</a>:`string`
Creator GUID to fetch videos from.
#### <a name="fetchAfter">fetchAfter</a>:`number`? = `0`
Offset from latest video to start fetching from.<br>

### Examples:
```js
const videos = await floatplane.creator.videos("creatorGUID") // Array of 20 videos
const videos2 = await floatplane.creator.videos("creatorGUID", 20) // Array of next 20 videos
```
<br>

### floatplane.[creator](#_creator).<a name="creator_videosIterable">videosIterable</a>([creatorGUID](#creatorGUID), [fetchAfter](#fetchAfter)?): AsyncIterator\<[Video](#video_type)>
Fetch creator videos. Returns a async iterator that will return all videos from the specified creator.<br>
Videos are fetched in batches of 20.<br>

#### <a name="creatorGUID">creatorGUID</a>:`string`
Creator GUID to fetch videos from.
#### <a name="fetchAfter">fetchAfter</a>:`number`? = `0`
Offset from latest video to start fetching from.<br>

### Examples:
```js
const videos = floatplane.creator.videosIterable("creatorGUID")
const firstVideo = await videos.next() // Fetch one video
```
```js
const videos = floatplane.creator.videosIterable("creatorGUID")
for await (const video of videos) {
	// Loops over every video from the creator.
}
```
<br>
<br>

## <a name="_user">User</a>
---
### floatplane.[user](#_user).<a name="user_subscriptions">subscriptions</a>(): Promise\<Array<[Subscription](#subscription)>>
Fetches subscriptions for current user.<br>

### Example:
```js
const subscriptions = await floatplane.user.subscriptions()
```
<br>
<br>

## <a name="_video">Video</a>
---
### floatplane.[video](#_video).<a name="video_downloadURL">downloadURL</a>([videoGUID](#videoGUID), [videoQuality](#videoQuality)?): Promise\<string>
Fetches download URL for specified videoGUID.<br>

#### <a name="videoGUID">videoGUID</a>:`string`
Creator GUID to fetch videos from.
#### <a name="videoQuality">videoQuality</a>:`string`? = `"360"`
Quality download url should be at, defaults to 360p.<br>

### Example:
```js
const videoDownloadURL = await floatplane.video.downloadURL("videoGUID", "720")
```
<br>

### floatplane.[video](#_video).<a name="video_download">download</a>([videoGUID](#videoGUID), [videoQuality](#videoQuality)?): Promise\<[DuplexStream](https://www.npmjs.com/package/got#streams-1)>
Starts downloading specified videoGUID and returns a [got duplex stream](https://www.npmjs.com/package/got#streams-1).<br>

#### <a name="videoGUID">videoGUID</a>:`string`
Creator GUID to fetch videos from.
#### <a name="videoQuality">videoQuality</a>:`string`? = `"360"`
Quality download url should be at, defaults to 360p.<br>

### Example:
```js
const fs = require('fs')
const videoDownloadStream = await floatplane.video.download("videoGUID", "720")

videoDownloadStream.pipe(fs.createWriteStream('video.mp4')) // Pipe video download to file
videoDownloadStream.on('downloadProgress', console.log) // Log process to console
```
<br>

# Types
## <a name="got_type">Got</a>
https://www.npmjs.com/package/got<br>
Got is the http/https library used for handling requests sent to floatplane.<br>
When importing individual classes a `got` instance is required to be passed to their constructor.<br>
In order for requests to be authenticated a single instance of `got` should be used for all classes and got should be extended with `mutableDefaults: true`.
```js
// You can set default headers here too, check the got docs for more info
const got = require('got').extend({ mutableDefaults: true }) 
const Auth = require('floatplane/auth')
const User = require('floatplane/user')

// Same instance of got used for both constructors so that cookies are shared
const auth = new Auth(got)
const user = new User(got)
```

## <a name="user_type">User</a>
```js
{ 
	needs2FA: boolean,
	user: {
		id: string,
		username: string,
		profileImage: {
			width: number,
			height: number,
			path: string,
			childImages: Array<{ 
				width: number, 
				height: number, 
				path: string
			}>
		}
	}
}
```

## <a name="video_type">Video</a>
```js
{
	id: string,
	guid: string,
	title: string,
	type: string,
	description: string,
	releaseDate: string,
	duration: number,
	creator: string,
	likes: number,
	dislikes: number,
	score: number,
	isProcessing: boolean,
	primaryBlogPost: string,
	thumbnail: {
		width: number,
		height: number,
		path: string,
		childImages: Array<{ 
			width: number, 
			height: number, 
			path: string 
		}>
	},
	isAccessible: boolean,
	hasAccess: boolean,
	private: boolean,
	subscriptionPermissions: Array<string>
}
```

## <a name="edges_type">Edges</a>
```js
{
	edges: Array<{
		hostname: string,
		queryPort: number,
		bandwidth: number,
		allowDownload: boolean,
		allowStreaming: boolean,
		datacenter: {
			countryCode: string,
			regionCode: string,
			latitude: number,
			longitude: number
		}
	}>,
	client: {
		ip: string,
		country_code: string,
		country_name: string,
		region_code: string,
		region_name: string,
		city: string,
		zip_code: string,
		time_zone: string,
		latitude: number,
		longitude: number,
		metro_code: number
	}
}
```

## <a name="subscription_type">Subscription</a>
```js
{
	startDate: string,
	endDate: string,
	paymentID: number,
	interval: string,
	paymentCancelled: boolean,
	plan: {
		id: string,
		title: string,
		description: string,
		price: string,
		priceYearly: string,
		currency: string,
		logo: string,
		interval: string,
		featured: boolean,
		allowGrandfatheredAccess: boolean
	},
	creator: string
}
```

## Projects
The following projects use this library:

### [Floatplane Downloader](https://github.com/Inrixia/Floatplane-Downloader)