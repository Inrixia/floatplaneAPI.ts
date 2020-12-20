import got from "got";
import Creator from ".";
import { imageFormat, prepCookieJar } from "../lib/testHelpers";

import type { Video } from ".";
export const videoFormat: Video = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	type: expect.any(String),
	description: expect.any(String),
	releaseDate: expect.any(String),
	duration: expect.any(Number),
	creator: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	isProcessing: expect.any(Boolean),
	primaryBlogPost: expect.any(String),
	thumbnail: imageFormat,
	isAccessible: expect.any(Boolean),
	hasAccess: expect.any(Boolean),
	private: expect.any(Boolean),
	subscriptionPermissions: expect.arrayContaining<string>([expect.any(String)])
};



test("Creator.videos(creatorGUID)", async () => {
	const creator = new Creator(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(creator.videos("59f94c0bdd241b70349eb72b")).resolves.toStrictEqual(expect.arrayContaining<Video>([videoFormat]));
});