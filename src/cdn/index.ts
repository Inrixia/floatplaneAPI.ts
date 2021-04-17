import Core from "../Core";

import type { Options } from "got/dist/source/core";
import { Client, Edge } from "../lib/types";
export type GotOptions = Options & { isStream: true };

export type DeliveryTypes = "live" | "vod" | "download";
export type DeliveryResponse = LiveDeliveryResponse | VodDeliveryResponse | DownloadDeliveryResponse;

export type QualityLevel = {
	name: string;
	width: number;
	height: number;
	label: string;
	order: number;
};

export type LiveDeliveryResponse = {
	cdn: string;
	strategy: string;
	resource: {
		// "/api/video/v1/~~.m3u8?token={token}&allow_source=false"
		uri: string;
		data: {
			token: string;
		};
	};
};
export type QualityLevelParam = { token: string };
export type VodDeliveryResponse = {
	cdn: string;
	strategy: string;
	resource: {
		// "/Videos/~~/{data.qualityLevel.name}.mp4/chunk.m3u8?token={data.qualityLevelParam.token}"
		uri: string;
		data: {
			qualityLevels: Array<QualityLevel>;
			qualityLevelParams: { 
				[key: string]: QualityLevelParam 
			};
		};
	};
};
export type DownloadDeliveryResponse = {
	client?: Client;
	edges: Array<Edge>;
	strategy: string;
	resource: {
		// "/Videos/{videoGUID}/{data.qualityLevel.name}.mp4?wmsAuthSign={data.token}"
		uri: string;
		data: {
			qualityLevels: Array<QualityLevel>;
			token: string;
		};
	};
};

export default class CDN extends Core {
	endpoints = {
		url: "https://www.floatplane.com/api/v2/cdn/delivery",
	};

	/**
	 * Fetches resource information from cdn.
	 * @param type Type of resource to fetch info for.
	 * @param id ID of resource.
	 */
	async delivery(type: "live", creator: string): Promise<LiveDeliveryResponse>;
	async delivery(type: "vod", guid: string): Promise<VodDeliveryResponse>;
	async delivery(type: "download", guid: string): Promise<DownloadDeliveryResponse>;
	async delivery(type: DeliveryTypes, id: string): Promise<DeliveryResponse> {
		return await this.got(this.endpoints.url + `?type=${type}` + (type === "live" ? `&creator=${id}` : `&guid=${id}`), { resolveBodyOnly: true }).then(JSON.parse);
	}
}
