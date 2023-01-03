import { Core } from "./Core.js";

import { ApiPaths, type operations } from "./lib/apiSchema.js";

export type ContentPost = operations["getBlogPost"]["responses"][200]["content"]["application/json"];
type PostParams = operations["getBlogPost"]["parameters"]["query"];

export class Content extends Core {
	/**
	 * A specific post from the floatplane api by id
	 */
	post = (id: PostParams["id"]): Promise<ContentPost> => this.got(`${this.BaseUrl}${ApiPaths.getBlogPost}/?id=${id}`).json();
}
