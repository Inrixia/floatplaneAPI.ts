import { expect, test } from "vitest";

import got from "got";
import { Api } from "./index.js";

import { clientFormat, edgeFormat, gotExtends, type Edge } from "../lib/testHelpers.js";

import type { EdgesResponse } from "./index.js";

export const edgesResponseFormat: EdgesResponse = {
	edges: expect.arrayContaining<Edge>([edgeFormat]),
	client: clientFormat,
};

const api = new Api(got.extend(gotExtends()));

test("Api.edges()", () => {
	return expect(api.edges()).resolves.toStrictEqual(edgesResponseFormat);
});
