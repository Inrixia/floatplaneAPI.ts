import { Core } from "../Core.js";

import type { Options } from "got";

import { type components, type operations, ApiPaths } from "../lib/apiSchema.js";

export type GotOptions = Options & { isStream: true };

export type VodDeliveryResponse = components["schemas"]["CdnDeliveryV2VodResponse"];
export type LiveDeliveryResponse = components["schemas"]["CdnDeliveryV2LivestreamResponse"];
export type DownloadDeliveryResponse = components["schemas"]["CdnDeliveryV2DownloadResponse"];

export type DeliveryResponse = components["schemas"]["CdnDeliveryV2Response"];

type QueryParams = operations["getDeliveryInfo"]["parameters"]["query"];
export class CDN extends Core {
	/**
	 * Fetches resource information from cdn.
	 */
	delivery(type: "live", creator: string): Promise<LiveDeliveryResponse>;
	delivery(type: "vod", guid: string): Promise<VodDeliveryResponse>;
	delivery(type: "download", guid: string): Promise<DownloadDeliveryResponse>;
	delivery(type: QueryParams["type"], id: string): Promise<DeliveryResponse> {
		const url = new URL(this.BaseUrl + ApiPaths.getDeliveryInfo);

		url.searchParams.set("type", type);

		if (type === "live") url.searchParams.set("creator", id);
		else url.searchParams.set("guid", id);

		return this.got(url.href).json();
	}
}
