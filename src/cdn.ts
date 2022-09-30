import { Core } from "./Core.js";

import type { Options } from "got";

import { type components, type operations, ApiPaths } from "./lib/apiSchema.js";
import { fillTemplate } from "@inrixia/helpers/object";

export type GotOptions = Options & { isStream: true };

export type LiveDeliveryResponse = components["schemas"]["CdnDeliveryV2VodLivestreamResponse"];
export type DownloadDeliveryResponse = components["schemas"]["CdnDeliveryV2DownloadResponse"];

export type DeliveryResponse = components["schemas"]["CdnDeliveryV2Response"];

type QueryParams = operations["getDeliveryInfo"]["parameters"]["query"];
export class CDN extends Core {
	/**
	 * Fetches resource information from cdn.
	 */
	delivery(type: "live", creator: string): Promise<LiveDeliveryResponse>;
	delivery(type: "download", guid: string): Promise<DownloadDeliveryResponse>;
	delivery(type: QueryParams["type"], id: string): Promise<DeliveryResponse> {
		const url = new URL(this.BaseUrl + ApiPaths.getDeliveryInfo);

		url.searchParams.set("type", type);

		if (type === "live") url.searchParams.set("creator", id);
		else url.searchParams.set("guid", id);

		return this.got(url.href).json();
	}

	fillUrl(response: DeliveryResponse, quality?: string): string {
		const { data, uri } = response.resource;
		if (quality === undefined) return fillTemplate(data, uri);
		if (data.qualityLevels?.some((level) => quality === level.name) !== true) throw new Error(`Quality "${quality}" is not present in response qualityLevels!`);
		return fillTemplate(data, uri.replaceAll("qualityLevelParams", `qualityLevelParams.${quality}`).replaceAll("{qualityLevels}", quality));
	}
}
