import got from "got";
import API from "./";
import { prepCookieJar } from "../lib/testHelpers";

import type { EdgesResponse, Edge, Client } from "./";
export const clientFormat: Client = {
	ip: expect.any(String),
	country_code: expect.any(String),
	country_name: expect.any(String),
	region_code: expect.any(String),
	region_name: expect.any(String),
	city: expect.any(String),
	zip_code: expect.any(String),
	time_zone: expect.any(String),
	latitude: expect.any(Number),
	longitude: expect.any(Number),
	metro_code: expect.any(Number)
};
export const edgeFormat: Edge = {
	hostname: expect.any(String),
	queryPort: expect.any(Number),
	bandwidth: expect.any(Number),
	allowDownload: expect.any(Boolean),
	allowStreaming: expect.any(Boolean),
	datacenter: {
		countryCode: expect.any(String),
		regionCode: expect.any(String),
		latitude: expect.any(Number),
		longitude: expect.any(Number)
	}
};
export const edgesResponseFormat: EdgesResponse = {
	edges: expect.arrayContaining<Edge>([edgeFormat]),
	client: clientFormat
};

test("Api.edges()", async () => {
	const api = new API(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(api.edges()).resolves.toStrictEqual<EdgesResponse>(edgesResponseFormat);
});