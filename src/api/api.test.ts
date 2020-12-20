import { toMatchFormat } from "@inrixia/helpers/jest";

import got from "got";
import FloatplaneAPI from "./";

const api = new FloatplaneAPI(got.extend({ cookieJar:  }));
api.cookie = (new (require("@inrixia/db"))("credentials", "./credentials.json", false)).cookie;

const edgesFormat = {
	edges: [{
		hostname: "string",
		queryPort: "number",
		bandwidth: "number",
		allowDownload: "boolean",
		allowStreaming: "boolean",
		datacenter: {
			countryCode: "string",
			regionCode: "string",
			latitude: "number",
			longitude: "number"
		}
	}],
	client: {
		ip: "string",
		country_code: "string",
		country_name: "string",
		region_code: "string",
		region_name: "string",
		city: "string",
		zip_code: "string",
		time_zone: "string",
		latitude: "number",
		longitude: "number",
		metro_code: "number"
	}
};

expect.extend({ toMatchFormat });

test("edges", () => expect(api.edges()).resolves.toMatchFormat(edgesFormat));