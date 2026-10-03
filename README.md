# Unofficial Floatplane API

This library is not in any way related to LMG or Floatplane Media Inc.

Features/Endpoints are added as needed so if something is missing please make a [Issue](https://github.com/Inrixia/floatplaneAPI.ts/issues/new) or fork, add it yourself and [Pull Request](https://github.com/Inrixia/floatplaneAPI.ts/pulls)

### Install

`$ npm install floatplane`

### Types & Docs

This library uses & collaborates with the **[Floatplane API Specification](https://github.com/Jman012/FloatplaneAPI)** which has full **[documentation](https://jamamp.github.io/FloatplaneAPIDocs/)** for most Floatplane endpoints including ones this library has not yet implemented.

### Example Usage

```ts
import { Floatplane, type AuthToken, OnDeviceCode } from 'floatplane';

class AuthTokenStore {
    authToken?: AuthToken;
}

const onDeviceCode: OnDeviceCode = async ({ verification_uri_complete, verification_uri }) => {
    const verifyUri = verification_uri_complete ?? verification_uri;
    console.log(`Please login to Floatplane via ${verifyUri}`);
};

const authTokenStore = new AuthTokenStore();

const floatplane = new Floatplane({
	authConfig: {
		clientId: "example-client",	// Has to be registered on FloatPlane
		authToken: authTokenStore.authToken,
		onAuthToken: (authToken) => {authTokenStore.authToken = authToken},
		onDeviceCode,
	},
	userAgent: `ExampleApp`, // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent
});

// Fetch User subscriptions
const subs = await floatplane.user.subscriptions();

// 20 Latest videos from first subscription
const videos = await floatplane.creator.blogPosts(subs[0].creator, { hasVideo: true });

// Fetch all videos asynchronously
for await (const video of floatplane.creator.blogPostsIterable(subs[0].creator, { hasVideo: true })) {
	console.log(video);
}
```

Take a look at https://github.com/Inrixia/Floatplane-Downloader/blob/055e21e42c0af89a68cdf2f58a195cc81ad07ddf/src/lib/helpers/index.ts#L49-L58 for a reference implementation.

Individual classes can also be imported seperately:

```ts
import { Auth } from "floatplane/auth";
```

<br/>

## Projects

The following projects use this library:

### [Floatplane Downloader](https://github.com/Inrixia/Floatplane-Downloader)
