# Unofficial Floatplane API

This library is not in any way related to LMG or Floatplane Media Inc.

Features/Endpoints are added as needed so if something is missing please make a [Issue](https://github.com/Inrixia/floatplaneAPI.ts/issues/new) or fork, add it yourself and [Pull Request](https://github.com/Inrixia/floatplaneAPI.ts/pulls)

### Install

`$ npm install floatplane`

### Types & Docs

This library uses & collaborates with the **[Floatplane API Specification](https://github.com/Jman012/FloatplaneAPI)** which has full **[documentation](https://jman012.github.io/FloatplaneAPIDocs/)** for most Floatplane endpoints including ones this library has not yet implemented.

### Example Usage

```ts
import { Floatplane } from "./index.js";

const floatplane = new Floatplane(); // Create a new API instance.

// login -> User object
const { user } = await floatplane.login({
	username: "yourUsername",
	password: "yourPassword",
	token: "yourTokenIfYouUse2Factor",
});
console.log(user);

// Fetch User subscriptions
const subs = await floatplane.user.subscriptions();

// 20 Latest videos from first subscription
const videos = await floatplane.creator.blogPosts(subs[0].creator, { hasVideo: true });

// Fetch all videos asynchronously
for await (const video of floatplane.creator.blogPostsIterable(subs[0].creator, { hasVideo: true })) {
	console.log(video);
}
```

Individual classes can also be imported seperately:

```ts
import { Auth } from "floatplane/auth";
```

<br/>

## Projects

The following projects use this library:

### [Floatplane Downloader](https://github.com/Inrixia/Floatplane-Downloader)
