import got from "got";
import CDN, { LiveDeliveryResponse, QualityLevel, QualityLevelParam, VideoDeliveryResponse, VodDeliveryResponse } from ".";
import { clientFormat, edgeFormat, prepCookieJar } from "../lib/testHelpers";
import { Edge } from "../lib/types";

import "jest-extended";

const qualityLevelFormat: QualityLevel = {
	name: expect.any(String),
	width: expect.any(Number),
	height: expect.any(Number),
	label: expect.any(String),
	order: expect.any(Number),
};

const liveDeliveryResponseFormat: LiveDeliveryResponse = {
	cdn: expect.any(String),
	strategy: expect.any(String),
	resource: {
		uri: expect.any(String),
		data: {
			token: expect.any(String),
		},
	},
};
const qualityLevelParamFormat: QualityLevelParam = {
	token: expect.any(String),
};
const vodDeliveryResponseFormat: VodDeliveryResponse = {
	cdn: expect.any(String),
	strategy: expect.any(String),
	resource: {
		uri: expect.any(String),
		data: {
			qualityLevels: expect.arrayContaining<QualityLevel>([qualityLevelFormat]),
			qualityLevelParams: expect.toContainValues([qualityLevelParamFormat]),
		},
	},
};
const videoDeliveryResponseFormat: VideoDeliveryResponse = {
	client: clientFormat,
	edges: expect.arrayContaining<Edge>([edgeFormat]),
	strategy: expect.any(String),
	resource: {
		uri: expect.any(String),
		data: {
			qualityLevels: expect.arrayContaining<QualityLevel>([qualityLevelFormat]),
			token: expect.any(String),
		},
	},
};

test("CDN.delivery(\"live\", creator)", async () => {
	const cdn = new CDN(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(cdn.delivery("live", "59f94c0bdd241b70349eb72b")).resolves.toStrictEqual<LiveDeliveryResponse>(liveDeliveryResponseFormat);
});

test("CDN.delivery(\"vod\", guid)", async () => {
	const cdn = new CDN(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(cdn.delivery("vod", "InwhyES1dt")).resolves.toStrictEqual<VodDeliveryResponse>(vodDeliveryResponseFormat);
});

test("CDN.delivery(\"download\", guid)", async () => {
	const cdn = new CDN(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(cdn.delivery("download", "InwhyES1dt")).resolves.toStrictEqual<VideoDeliveryResponse>(videoDeliveryResponseFormat);
});
