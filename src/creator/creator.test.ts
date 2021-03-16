import got from "got";
import Creator from ".";
import { imageFormat, prepCookieJar, creatorObjFormat, eExpect, metadataFormat } from "../lib/testHelpers";

import type { BlogPost } from ".";
export const blogPostFormat: BlogPost = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	text: expect.any(String),
	type: expect.any(String),
	attachmentOrder: expect.arrayContaining<string>([expect.any(String)]),
	metadata: metadataFormat,
	releaseDate: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	comments: expect.any(Number),
	creator: creatorObjFormat,
	isAccessible: expect.any(Boolean),
	thumbnail: imageFormat,
	videoAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	audioAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	pictureAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	galleryAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
};

test("Creator.videos(creatorGUID)", async () => {
	const creator = new Creator(got.extend({ cookieJar: await prepCookieJar() }));
	// return expect((await creator.blogPosts("59f94c0bdd241b70349eb72b"))[0]).toStrictEqual(blogPostFormat);
	return expect(creator.blogPosts("59f94c0bdd241b70349eb72b")).resolves.toStrictEqual(
		expect.arrayContaining<BlogPost>([blogPostFormat])
	);
});
