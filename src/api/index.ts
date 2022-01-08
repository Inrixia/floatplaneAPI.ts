import { Core } from "../Core";
import { Client, Edge } from "../lib/types";

export type EdgesResponse = {
	edges: Edge[];
	client: Client;
};

export class Api extends Core {
	endpoints = {
		edges: "https://www.floatplane.com/api/edges",
	};

	/**
	 * Fetch edges from the floatplane api
	 */
	edges = async (): Promise<EdgesResponse> => await this.got(this.endpoints.edges, { resolveBodyOnly: true }).then(JSON.parse);
}
