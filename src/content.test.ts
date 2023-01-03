import { expect, test } from "vitest";

import got from "got";
import { Content } from "./content.js";

import { gotExtends, contentPostFormat } from "./lib/testHelpers.js";

const content = new Content(got.extend(gotExtends()));

test("Content.post(videoId)", () => {
	return expect(content.post("xL64iWbreb")).resolves.toStrictEqual(contentPostFormat);
});
