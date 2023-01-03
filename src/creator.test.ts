import { test } from "vitest";

import got from "got";
import { Creator } from "./creator.js";
import { blogPostFormat, gotExtends, expect } from "./lib/testHelpers.js";

import type { BlogPost } from "./creator.js";

const creator = new Creator(got.extend(gotExtends()));

test("Creator.blogPosts(creatorGUID)", () => {
	return expect(creator.blogPosts("59f94c0bdd241b70349eb72b")).resolves.toStrictEqual(expect.arrayContaining<BlogPost>([blogPostFormat]));
});

test("Creator.blogPostsIterable(creatorGUID).next()", async () => {
	return expect((await creator.blogPostsIterable("59f94c0bdd241b70349eb72b").next()).value).toStrictEqual(blogPostFormat);
});

test("for await (const blogPost of Creator.blogPostsIterable(creatorGUID))", async () => {
	for await (const blogPost of creator.blogPostsIterable("59f94c0bdd241b70349eb72b")) {
		return expect(blogPost).toStrictEqual(blogPostFormat);
	}
});
