import { Core } from "../Core";
import type { CreatorObj, Image, Metadata } from "../lib/types";

export type BlogPost = {
	id: string;
	guid: string;
	title: string;
	tags: string[];
	text: string;
	type: string;
	attachmentOrder: string[];
	metadata: Metadata;
	releaseDate: string;
	likes: number;
	dislikes: number;
	score: number;
	comments: number;
	creator: CreatorObj;
	thumbnail: Image;
	isAccessible: boolean;
	videoAttachments: string[];
	audioAttachments: string[];
	pictureAttachments: string[];
	galleryAttachments: string[];
	wasReleasedSilently: boolean;
};
export class Creator extends Core {
	endpoints = {
		videos: "https://www.floatplane.com/api/v3/content/creator",
	};

	/**
	 * Fetch blogPosts from a creator, returns a Async Iterator.
	 * @param creatorGUID Creator GUID to fetch content for.
	 * @param options.type Filter BlogPosts by attachment types. Can be "audio", "video", "picture" or "gallery".
	 * @param options.sort Sort by releaseDate. Can be "DESC" or "ASC".
	 * @param options.search Filter BlogPosts by search term.
	 * @returns {AsyncIterable<BlogPost>} Async iterable that yeilds blogPost objects
	 */
	async *blogPostsIterable(
		creatorGUID: string,
		options?: {
			type?: "audio" | "video" | "picture" | "gallery";
			sort?: "ASC" | "DESC";
			search?: string;
		}
	): AsyncIterableIterator<BlogPost> {
		let fetchAfter = 0;
		let blogPosts = await this.blogPosts(creatorGUID, { ...options, fetchAfter });
		while (blogPosts.length > 0) {
			yield* blogPosts;
			fetchAfter += 20;
			blogPosts = await this.blogPosts(creatorGUID, { ...options, fetchAfter });
		}
	}

	/**
	 * Fetch blogPosts from a creator.
	 * @param creatorGUID Creator GUID to fetch content for.
	 * @param options.fetchAfter Number of videos from the latest to fetch from.
	 * @param options.type Filter BlogPosts by attachment types. Can be "audio", "video", "picture" or "gallery".
	 * @param options.sort Sort by releaseDate. Can be "DESC" or "ASC".
	 * @param options.search Filter BlogPosts by search term.
	 * @param options.limit Max amount of BlogPosts to return. Must be in range 1-20.
	 * @returns {Promise<BlogPost[]>}
	 */
	blogPosts = async (
		creatorGUID: string,
		options?: {
			fetchAfter?: number;
			type?: "audio" | "video" | "picture" | "gallery";
			sort?: "ASC" | "DESC";
			search?: string;
			limit?: number;
		}
	): Promise<BlogPost[]> =>
		await this.got(
			this.endpoints.videos +
				`?id=${creatorGUID}` +
				(options?.fetchAfter ? `&fetchAfter=${options?.fetchAfter}` : "") +
				(options?.type ? `&type=${options?.type}` : "") +
				(options?.sort ? `&sort=${options?.sort}` : "") +
				(options?.search ? `&search=${options?.search}` : "") +
				(options?.limit ? `&type=${options?.limit}` : ""),
			{ resolveBodyOnly: true }
		).then(JSON.parse);
}
