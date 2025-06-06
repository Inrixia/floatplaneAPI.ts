import { Core } from "./Core.js";

import type { OptionalOnly } from "@inrixia/helpers";
import { type components, type operations, ApiPaths } from "./lib/apiSchema.js";

export type BlogPost = components["schemas"]["BlogPostModelV3"];
type BlogPostQueryParams = operations["getCreatorBlogPosts"]["parameters"]["query"];

export type CreatorInfo = components["schemas"]["CreatorModelV2"];
type CreatorQueryParams = operations["getInfo"]["parameters"]["query"];

export type CreatorChannel = components["schemas"]["ChannelModel"];
type CreatorChannelsQueryParams = operations["listCreatorChannelsV3"]["parameters"]["query"];
export class Creator extends Core {
	/**
	 * Fetch blogPosts from a creator, returns a Async Iterator.
	 */
	async *blogPostsIterable(creatorGUID: string, options?: Omit<OptionalOnly<BlogPostQueryParams>, "fetchAfter">): AsyncIterableIterator<BlogPost> {
		let fetchAfter = 0;
		let blogPosts = await this.blogPosts(creatorGUID, { ...options, fetchAfter });
		while (blogPosts.length > 0) {
			yield* blogPosts;
			fetchAfter += 20;
			blogPosts = await this.blogPosts(creatorGUID, { ...options, fetchAfter });
		}
	}

	/**
	 *	Fetch blogPosts from a creator.
	 */
	blogPosts = (creatorGUID: BlogPostQueryParams["id"], options?: OptionalOnly<BlogPostQueryParams>): Promise<BlogPost[]> => {
		const url = new URL(this.BaseUrl + ApiPaths.getCreatorBlogPosts);
		url.searchParams.append("id", creatorGUID);
		if (options !== undefined) {
			const { limit, fetchAfter, search, tags, hasVideo, hasAudio, hasPicture, hasText, sort, fromDuration, toDuration, fromDate, toDate, channel } = options;
			if (channel !== undefined) url.searchParams.append("channel", channel.toString());
			if (limit !== undefined) url.searchParams.append("limit", limit.toString());
			if (fetchAfter !== undefined) url.searchParams.append("fetchAfter", fetchAfter.toString());
			if (search !== undefined) url.searchParams.append("search", search);
			if (tags !== undefined) url.searchParams.append("tags", tags.join(","));

			if (hasVideo !== undefined) url.searchParams.append("hasVideo", hasVideo.toString());
			if (hasAudio !== undefined) url.searchParams.append("hasAudio", hasAudio.toString());
			if (hasPicture !== undefined) url.searchParams.append("hasPicture", hasPicture.toString());
			if (hasText !== undefined) {
				if (hasVideo === true) throw new Error("hasVideo cannot be true if hasText is true");
				if (hasAudio === true) throw new Error("hasAudio cannot be true if hasText is true");
				if (hasPicture === true) throw new Error("hasPicture cannot be true if hasText is true");
				url.searchParams.append("hasText", hasText.toString());
			}

			if (sort !== undefined) url.searchParams.append("sort", sort);

			if (fromDuration !== undefined) {
				if (hasVideo !== true) throw new Error("hasVideo must be true if fromDuration is set");
				url.searchParams.append("fromDuration", fromDuration.toString());
			}
			if (toDuration !== undefined) {
				if (hasVideo !== true) throw new Error("hasVideo must be true if toDuration is set");
				url.searchParams.append("toDuration", toDuration.toString());
			}

			if (fromDate !== undefined) url.searchParams.append("fromDate", fromDate.toString());
			if (toDate !== undefined) url.searchParams.append("toDate", toDate.toString());
		}
		return this.got(url.href).json();
	};

	info = (creatorGUID: CreatorQueryParams["creatorGUID"]): Promise<CreatorInfo[]> =>
		this.got(`${this.BaseUrl}${ApiPaths.getInfo}?creatorGUID=${creatorGUID}`).json();

	channels = (creatorGUID: CreatorChannelsQueryParams["ids"]): Promise<CreatorChannel[]> =>
		this.got(`${this.BaseUrl}${ApiPaths.listCreatorChannelsV3}?ids=${creatorGUID}`).json();
}
