module.exports = class Creator {
	endpoints = {
		videos: "https://www.floatplane.com/api/creator/videos?creatorGUID=%creatorGUID%&fetchAfter=%fetchAfter%"
	}
	constructor(got) {
		this.got = got
	}

	/**
	 * Fetch videos from a creator.
	 * @param {number} creatorGUID Creator GUID id to fetch videos for.
	 * @param {number} fetchAfter Number of videos from the latest to fetch from.
	 * @returns {AsyncIterator<{
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
	}>} Async iterator that yeilds video objects
	*/
	async * videos(creatorGUID, fetchAfter=0) {
		let videos = [null]
		let i = 0;
		while (videos.length > 0) {
			videos = JSON.parse((await this.got(this.endpoints.videos.replace('%creatorGUID%', creatorGUID).replace('%fetchAfter%', fetchAfter+i))).body)
			yield* videos
			i += 20
		}
	}
}