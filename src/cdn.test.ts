import { test } from "vitest";

import got from "got";
import { CDN, V2VodLiveDeliveryResponse, V2DownloadDeliveryResponse, DeliveryResponse } from "./cdn.js";
import { clientFormat, edgeFormat, gotExtends, expect } from "./lib/testHelpers.js";

import type { components } from "./lib/apiSchema.js";

const qualityLevelFormat: components["schemas"]["CdnDeliveryV2QualityLevelModel"] = {
	name: expect.any(String),
	width: expect.any(Number),
	height: expect.any(Number),
	label: expect.any(String),
	order: expect.any(Number),
	mimeType: expect.typeOrNull(String),
	codecs: expect.typeOrNull(String),
};
const Strategy = ["cdn", "client"] as const;
const V2liveDeliveryResponseFormat: V2VodLiveDeliveryResponse = {
	cdn: expect.any(String),
	strategy: expect.enum(Strategy),
	resource: {
		uri: expect.any(String),
		data: {
			token: expect.any(String),
		},
	},
};

const V2downloadDeliveryResponseFormat: V2DownloadDeliveryResponse = {
	edges: expect.arrayContainingOrEmpty([edgeFormat]),
	client: clientFormat,
	strategy: expect.enum(Strategy),
	resource: {
		uri: expect.any(String),
		data: {
			qualityLevels: expect.arrayContaining<components["schemas"]["CdnDeliveryV2QualityLevelModel"]>([qualityLevelFormat]),
			token: expect.any(String),
		},
	},
};

const origin: components["schemas"]["CdnDeliveryV3Origin"] = {
	url: expect.any(String),
	queryUrl: expect.typeOrUndefined(String),
	datacenter: {
		latitude: expect.any(Number),
		longitude: expect.any(Number),
		countryCode: expect.any(String),
		regionCode: expect.any(String),
	},
};
const cdnDeliveryV3MediaIdentityCharacteristics: components["schemas"]["CdnDeliveryV3MediaIdentityCharacteristics"] = {
	codec: expect.typeOrUndefined(String),
	codecSimple: expect.typeOrUndefined(String),
	mimeType: expect.typeOrUndefined(String),
};
const cdnDeliveryV3ImagePresentationCharacteristics: components["schemas"]["CdnDeliveryV3ImagePresentationCharacteristics"] = {
	width: expect.typeOrUndefined(Number),
	height: expect.typeOrUndefined(Number),
	isHdr: expect.typeOrUndefined(Boolean),
};
const cdnDeliveryV3MediaBitrateInfo: components["schemas"]["CdnDeliveryV3MediaBitrateInfo"] = {
	bitrate: expect.objectContainingOrUndefined({
		maximum: expect.typeOrUndefined(Number),
		average: expect.typeOrUndefined(Number),
	}),
};
const cdnDeliveryMeta: components["schemas"]["CdnDeliveryV3Meta"] = {
	common: {
		size: expect.typeOrUndefined(Number),
		access: expect.objectContainingOrUndefined({
			deniedReason: expect.typeOrUndefined(expect.stringMatching(/isMissingPermission|isProcessing|isBroken/)),
			deniedMessage: expect.typeOrUndefined(String),
		}),
	},
	video: expect.objectContainingOrUndefined({
		...cdnDeliveryV3MediaIdentityCharacteristics,
		...cdnDeliveryV3ImagePresentationCharacteristics,
		fps: expect.typeOrUndefined(Number),
		...cdnDeliveryV3MediaBitrateInfo,
	}),
	audio: expect.objectContainingOrUndefined({
		...cdnDeliveryV3MediaIdentityCharacteristics,
		channelCount: expect.typeOrUndefined(Number),
		samplerate: expect.typeOrUndefined(Number),
		...cdnDeliveryV3MediaBitrateInfo,
	}),
	image: expect.objectContainingOrUndefined({
		...cdnDeliveryV3MediaIdentityCharacteristics,
		...cdnDeliveryV3ImagePresentationCharacteristics,
		live: expect.objectContainingOrUndefined({
			lowLatencyExtension: expect.typeOrUndefined(expect.stringMatching(/"llhls"|"clhls"|"ivshls"|"lldash"/)),
		}),
	}),
};
const variant: components["schemas"]["CdnDeliveryV3Variant"] = {
	name: expect.any(String),
	label: expect.any(String),
	url: expect.any(String),
	origins: expect.arrayContainingOrEmptyOrUndefined([origin]),
	order: expect.any(Number),
	enabled: expect.any(Boolean),
	hidden: expect.any(Boolean),
	meta: expect.objectContainingOrUndefined(cdnDeliveryMeta),
	mimeType: expect.any(String),
};
const deliveryResponseFormat: DeliveryResponse = {
	groups: expect.arrayContaining([
		expect.objectContaining({
			origins: expect.arrayContainingOrEmpty([origin]),
			variants: expect.arrayContaining([variant]),
		}),
	]),
};

const cdn = new CDN(got.extend(gotExtends()));

test('CDN.deliveryV2("live", creator)', () => {
	return expect(cdn.deliveryV2("live", "59f94c0bdd241b70349eb72b")).resolves.toStrictEqual(V2liveDeliveryResponseFormat);
});

test('CDN.deliveryV2("download", guid)', async () => {
	return expect(cdn.deliveryV2("download", "InwhyES1dt")).resolves.toStrictEqual(V2downloadDeliveryResponseFormat);
});

test('CDN.delivery("download", guid)', async () => {
	return expect(cdn.delivery("download", "O54NC8QsAy")).resolves.toStrictEqual(deliveryResponseFormat);
});
