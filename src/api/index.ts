import { Core } from "../Core.js";
import { BaseUrl } from "../lib/testHelpers.js";

import { type operations, ApiPaths } from "../lib/apiSchema.js";

export type EdgesResponse = operations["getEdges"]["responses"][200]["content"]["application/json"];

export class Api extends Core {
	/**
	 * Fetch edges from the floatplane api
	 */
	edges = (): Promise<EdgesResponse> => this.got(BaseUrl + ApiPaths.getEdges).json();
}
