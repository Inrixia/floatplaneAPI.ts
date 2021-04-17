import got from "got";
import API from "./";
import { clientFormat, edgeFormat, gotExtends } from "../lib/testHelpers";

import type { EdgesResponse} from "./";
import { Edge } from "../lib/types";

export const edgesResponseFormat: EdgesResponse = {
	edges: expect.arrayContaining<Edge>([edgeFormat]),
	client: clientFormat
};

const api = new API(got.extend(gotExtends()));

test("Api.edges()", () => {
	return expect(api.edges()).resolves.toStrictEqual<EdgesResponse>(edgesResponseFormat);
});