import got from "got";
import API from "./";
import { clientFormat, edgeFormat, prepCookieJar } from "../lib/testHelpers";

import type { EdgesResponse} from "./";
import { Edge } from "../lib/types";

export const edgesResponseFormat: EdgesResponse = {
	edges: expect.arrayContaining<Edge>([edgeFormat]),
	client: clientFormat
};

test("Api.edges()", async () => {
	const api = new API(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(api.edges()).resolves.toStrictEqual<EdgesResponse>(edgesResponseFormat);
});