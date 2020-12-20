import Core from "../Core";
import type { Image } from "../types";

export type Video = {
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
	thumbnail: Image,
	isAccessible: boolean,
	hasAccess: boolean,
	private: boolean,
	subscriptionPermissions: Array<string>
}
export default class Creator extends Core {
	endpoints = {
		videos: "https://www.floatplane.com/api/creator/videos?creatorGUID=%creatorGUID%&fetchAfter=%fetchAfter%"
	}

	/**
	 * Fetch videos from a creator, returns a Async Iterator.
	 * @param {string} creatorGUID Creator GUID id to fetch videos for.
	 * @param fetchAfter Number of videos from the latest to fetch from.
	 * @returns {AsyncIterator<Video>} Async iterator that yeilds video objects
	*/
	async * videosIterable(creatorGUID: string, fetchAfter=0): AsyncIterator<Video> {
		let i = 0;
		let videos = await this.videos(creatorGUID, fetchAfter+i);
		while (videos.length > 0) {
			yield* videos;
			i += 20;
			videos = await this.videos(creatorGUID, fetchAfter+i);
		}
	}

	/**
	 * Fetch videos from a creator.
	 * @param {string} creatorGUID Creator GUID id to fetch videos for.
	 * @param fetchAfter Number of videos from the latest to fetch from.
	 */
	videos = async (creatorGUID: string, fetchAfter=0): Promise<Array<Video>> => JSON.parse(
		(await this.got(this.endpoints.videos.replace("%creatorGUID%", creatorGUID).replace("%fetchAfter%", fetchAfter.toString()))).body
	)
}