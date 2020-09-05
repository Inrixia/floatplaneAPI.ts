const fs = require('fs')
const { lObj } = require('@inrixia/helpers/object')

const Floatplane = require('./')
const fapi = new Floatplane()

;(async () => {
	const login = await fapi.login(require('./testCredentials.json'))
	lObj(login)
	const subs = await fapi.user.subscriptions()
	lObj(subs)
	const videos = fapi.creator.videos(subs[0].creator)
	lObj(await videos.next(), '\n\n\n\n')
	for await (const video of videos) {
		console.log(video)
		break;
	}
	
	// const videoURL = await fapi.video.downloadURL(video.value.guid)
	// lObj(videoURL)
	// const stream = await fapi.video.download(video.value.guid)
	// stream.pipe(fs.createWriteStream('test.mp4'))
})()
