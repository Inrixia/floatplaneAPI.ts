import Core from "../Core";
import type { CreatorObj, Image } from "../lib/types";

export type Content = {
	id: string;
	guid: string;
	title: string;
	text: string;
	type: string;
	attachmentOrder: Array<string>;
	metadata: {
		hasVideo: boolean;
		videoCount: number;
		videoDuration: number;
		hasAudio: boolean;
		audioCount: number;
		audioDuration: number;
		hasPicture: boolean;
		pictureCount: number;
		hasGallery: boolean;
		galleryCount: number;
		isFeatured: boolean;
	};
	releaseDate: string;
	likes: number;
	dislikes: number;
	score: number;
	comments: number;
	creator: CreatorObj;
	thumbnail: Image;
	isAccessible: boolean;
	videoAttachments: Array<string>;
	audioAttachments: Array<string>;
	pictureAttachments: Array<string>;
	galleryAttachments: Array<string>;
};
export default class Creator extends Core {
	endpoints = {
		videos: "https://www.floatplane.com/api/v3/content/creator?id=%creatorGUID%&fetchAfter=%fetchAfter%",
	};

	/**
	 * Fetch content from a creator, returns a Async Iterator.
	 * @param {string} creatorGUID Creator GUID id to fetch videos for.
	 * @param fetchAfter Number of items from the latest to fetch from.
	 * @returns {AsyncIterable<Video>} Async iterable that yeilds content objects
	 */
	async *contentIterable(creatorGUID: string, fetchAfter = 0): AsyncIterable<Content> {
		let i = 0;
		let videos = await this.content(creatorGUID, fetchAfter + i);
		while (videos.length > 0) {
			yield* videos;
			i += 20;
			videos = await this.content(creatorGUID, fetchAfter + i);
		}
	}

	/**
	 * Fetch content from a creator.
	 * @param {string} creatorGUID Creator GUID id to fetch videos for.
	 * @param fetchAfter Number of videos from the latest to fetch from.
	 */
	content = async (creatorGUID: string, fetchAfter = 0): Promise<Array<Content>> => JSON.parse(await this.got(this.endpoints.videos.replace("%creatorGUID%", creatorGUID).replace("%fetchAfter%", fetchAfter.toString()), { resolveBodyOnly: true }));
}
