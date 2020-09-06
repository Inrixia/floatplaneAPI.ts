const Core = require('../core.js')

module.exports = class Creator extends Core {
	endpoints = {
		videos: "https://www.floatplane.com/api/creator/videos?creatorGUID=%creatorGUID%&fetchAfter=%fetchAfter%"
	}

	/**
	 * @typedef {{
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
			childImages: Array<{ width: number, height: number, path: string }>
		},
		isAccessible: boolean,
		hasAccess: boolean,
		private: boolean,
		subscriptionPermissions: Array<string>
	}} Video
	 */

	/**
	 * Fetch videos from a creator, returns a Async Iterator.
	 * @param {number} creatorGUID Creator GUID id to fetch videos for.
	 * @param {number} fetchAfter Number of videos from the latest to fetch from.
	 * @returns {AsyncIterator<Video>} Async iterator that yeilds video objects
	*/
	async * videosIterable(creatorGUID, fetchAfter=0) {
		let videos = [null]
		let i = 0;
		while (videos.length > 0) {
			videos = await this.videos(creatorGUID, fetchAfter+i)
			yield* videos
			i += 20
		}
	}

	/**
	 * Fetch videos from a creator.
	 * @param {string} creatorGUID Creator GUID id to fetch videos for.
	 * @param {number} fetchAfter Number of videos from the latest to fetch from.
	 * @returns {Array<Video>}
	 */
	videos = async (creatorGUID, fetchAfter=0) => this._middleware(await this.got(this.endpoints.videos.replace('%creatorGUID%', creatorGUID).replace('%fetchAfter%', fetchAfter)))
}