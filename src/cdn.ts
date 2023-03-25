import { Core } from "./Core.js";

import type { Options } from "got";

import { type components, type operations, ApiPaths } from "./lib/apiSchema.js";
import { fillTemplate } from "@inrixia/helpers/object";

export type GotOptions = Options & { isStream: true };

// V2
export type V2VodLiveDeliveryResponse = components["schemas"]["CdnDeliveryV2VodLivestreamResponse"];
export type V2DownloadDeliveryResponse = components["schemas"]["CdnDeliveryV2DownloadResponse"];
export type V2DeliveryResponse = components["schemas"]["CdnDeliveryV2Response"];
type QueryParamsV2 = operations["getDeliveryInfo"]["parameters"]["query"];

// V3
export type DeliveryResponse = components["schemas"]["CdnDeliveryV3Response"];
type QueryParams = operations["getDeliveryInfoV3"]["parameters"]["query"];

export class CDN extends Core {
	/**
	 * Fetches resource information from v2 cdn.
	 * @deprecated This function is deprecated and will be removed in future versions. Use the `delivery` function instead. This only exists for backwards compatibility.
	 */
	deliveryV2(type: "live", creator: string): Promise<V2VodLiveDeliveryResponse>;
	deliveryV2(type: "download", guid: string): Promise<V2DownloadDeliveryResponse>;
	deliveryV2(type: "vod", guid: string): Promise<V2VodLiveDeliveryResponse>;
	deliveryV2(type: "aod", guid: string): Promise<V2VodLiveDeliveryResponse>;
	deliveryV2(type: QueryParamsV2["type"], id: string): Promise<V2DeliveryResponse> {
		const url = new URL(this.BaseUrl + ApiPaths.getDeliveryInfo);

		url.searchParams.set("type", type);

		if (type === "live") url.searchParams.set("creator", id);
		else url.searchParams.set("guid", id);

		return this.got(url.href).json();
	}

	fillUrlV2(response: V2DeliveryResponse, quality?: string): string {
		const { data, uri } = response.resource;
		if (quality === undefined) return fillTemplate(data, uri);
		if (data.qualityLevels?.some((level) => quality === level.name) !== true) throw new Error(`Quality "${quality}" is not present in response qualityLevels!`);
		return fillTemplate(data, uri.replaceAll("qualityLevelParams", `qualityLevelParams.${quality}`).replaceAll("{qualityLevels}", quality));
	}

	/**
	 * Fetches resource information from cdn.
	 *
	 * @param scenario The scenario in which to consume the media.
	 * - `onDemand` = stream a Video/Audio On Demand
	 * - `download` = Download the content for the user to play later.
	 * - `live` = Livestream the content
	 * @param entityId The attachment or livestream identifier for the requested media. For video and audio, this would be from the `videoAttachments` or `audioAttachments` objects. For livestreams, this is the `liveStream.id` from the creator object.
	 * @param outputKind Use `outputKind` to ensure the right vehicle is used for your client, e.g. `outputKind=hls.fmp4` is optimal for tvOS 10+.
	 * @returns A promise that resolves to a `DeliveryResponse` object.
	 */
	delivery(scenario: QueryParams["scenario"], entityId: string, outputKind?: QueryParams["outputKind"]): Promise<DeliveryResponse> {
		const url = new URL(this.BaseUrl + ApiPaths.getDeliveryInfoV3);

		url.searchParams.set("scenario", scenario);
		url.searchParams.set("entityId", entityId);
		if (outputKind !== undefined) url.searchParams.set("outputKind", outputKind);

		return this.got(url.href).json();
	}
}
