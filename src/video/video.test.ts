import got from "got";
import Video from ".";
import { prepCookieJar } from "../lib/testHelpers";

export const urlFormat = new RegExp(/https:\/\/Edge\d\d-..\.floatplane\.com\/Videos\/8SV6hI9JLG\/360\.mp4/);

test("Video.url(videoGUID)", async () => { 
	const video = new Video(got.extend({ cookieJar: await prepCookieJar() }));
	return expect(video.url("8SV6hI9JLG")).resolves.toMatch(urlFormat);
});