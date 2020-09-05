const fs = require('fs')
const { lObj } = require('@inrixia/helpers/object')

const fAPI = require('./')
const fapi = new fAPI()

;(async () => {
	const login = await fapi.login(require('./testCredentials.json'))
	lObj(login)
	const subs = await fapi.user.subscriptions()
	lObj(subs)
	const video = await fapi.creator.videos(subs[0].creator).next()
	lObj(video)
	const videoURL = await fapi.video.downloadURL(video.value.guid)
	lObj(videoURL)
	// const stream = await fapi.video.download(video.value.guid)
	// stream.pipe(fs.createWriteStream('test.mp4'))
})()
