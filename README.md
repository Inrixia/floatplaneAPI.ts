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

## Example
```js
const Floatplane = require("floatplane");

const fApi = new fApi(); // Create a new API instance.

;(async () => { // Run with async/await
	const login = await fapi.login({
		username: "yourUsername",
		password: "yourPassword",
		token: "yourTokenIfYouUse2Factor"
	})
	// login -> User object
	const subs = await fapi.user.subscriptions()
	// subs -> User subscriptions
	const video = await fapi.creator.videos(subs[0].creator).next()
	// video -> Latest video from first subscription
})().catch(console.log) // Errors are logged to console
```

## Classes

TODO