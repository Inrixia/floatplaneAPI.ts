import { Core } from "./Core.js";

import { ApiPaths, type operations } from "./lib/apiSchema.js";

export type ContentPost = operations["getBlogPost"]["responses"][200]["content"]["application/json"];
type PostParams = operations["getBlogPost"]["parameters"]["query"];

export type VideoContent = operations["getVideoContent"]["responses"][200]["content"]["application/json"];
type VideoParams = operations["getVideoContent"]["parameters"]["query"];

export class Content extends Core {
	/**
	 * A specific post from the floatplane api by id
	 */
	post = (id: PostParams["id"]): Promise<ContentPost> => this.got(`${this.BaseUrl}${ApiPaths.getBlogPost}/?id=${id}`).json();

	/**
	 * A specific video attachment from the floatplane api by id
	 */
	video = (id: VideoParams["id"]): Promise<VideoContent> => this.got(`${this.BaseUrl}${ApiPaths.getVideoContent}/?id=${id}`).json();
}
