import Core from "../Core";

export type Edges = {
	edges: Array<{
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
	}>,
	client: {
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
}

export default class Api extends Core {
	endpoints = {
		edges: "https://www.floatplane.com/api/edges"
	}

	/**
	 * Fetch edges from the floatplane api
	 */
	edges = async (): Promise<Edges>  => JSON.parse((await this.got(this.endpoints.edges)).body)
}