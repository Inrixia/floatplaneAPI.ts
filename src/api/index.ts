import Core from "../Core";

export type Edge = {
	hostname: string,
	queryPort: number,
	bandwidth: number,
	allowDownload: boolean,
	allowStreaming: boolean,
	datacenter: {
		countryCode: string,
		regionCode: string,
		latitude: number,
		longitude: number
	}
}
export type Client = {
	ip: string,
	country_code: string,
	country_name: string,
	region_code: string,
	region_name: string,
	city: string,
	zip_code: string,
	time_zone: string,
	latitude: number,
	longitude: number,
	metro_code: number
}
export type EdgesResponse = {
	edges: Edge[],
	client: Client
}

export default class Api extends Core {
	endpoints = {
		edges: "https://www.floatplane.com/api/edges"
	}

	/**
	 * Fetch edges from the floatplane api
	 */
	edges = async (): Promise<EdgesResponse>  => JSON.parse((await this.got(this.endpoints.edges, { resolveBodyOnly: true })))
}