import { Core } from "./Core.js";

import type { Options } from "got";

import { type components, type operations, ApiPaths } from "./lib/apiSchema.js";

export type GotOptions = Options & { isStream: true };
// V3
export type DeliveryResponse = components["schemas"]["CdnDeliveryV3Response"];
type QueryParams = operations["getDeliveryInfoV3"]["parameters"]["query"];

export class CDN extends Core {
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
