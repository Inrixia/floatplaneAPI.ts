module.exports = class Video {
	endpoints = {
		url: "https://www.floatplane.com/api/video/url?guid=%guid%&quality=%quality%"
	}
	constructor(got) {
		this.got = got
	}

	/**
	 * Gets the URL to download a video
	 * @param {string} videoGUID GUID of video
	 * @param {string} videoQuality Quality wanted
	 * @returns {string} Video download URL
	 */
	downloadURL = async (videoGUID, videoQuality="360") => JSON.parse((await this.got(this.endpoints.url.replace('%guid%', videoGUID).replace('%quality%', videoQuality))).body).replace(/\/chunk.m3u8/, '')

	/**
	 * Downloads a video
	 * @param {string} videoGUID GUID of video
	 * @param {string} videoQuality Quality wanted
	 * @returns {} Stream containing video data and events: https://github.com/sindresorhus/got#streams-1
	 * @example
	 * const fs = require('fs')
	 * const stream = await download("jImMbJ2pbE", "360")
	 * stream.pipe(fs.createWriteStream('video.mp4')) // Saves video to 'video.mp4'
	 */
	download = async (videoGUID, videoQuality="360") => this.got.stream(await this.downloadURL(videoGUID, videoQuality))
}