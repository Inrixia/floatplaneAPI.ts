import { lObj } from "@inrixia/helpers/object";
import db from "@inrixia/db";

import { LoginOptions } from "../dist";

const credentials = db<LoginOptions>("./credentials.json", false) as LoginOptions;

import Floatplane from "../dist";
const fapi = new Floatplane();

import { FileCookieStore } from "tough-cookie-file-store";
const CFS = new FileCookieStore("./cookieStore.json");

(async () => {
	if (CFS.isEmpty()) await fapi.login(credentials);

	const subs = await fapi.user.subscriptions();
	lObj(subs[0]);
	const video = await fapi.creator.videos(subs[0].creator);
	lObj(video[0]);
	// lObj(await fapi.video.url(video.guid))
	// for await (const video of videos) {
	// 	console.log(video)
	// 	break;
	// }
	
	// const videoURL = await fapi.video.downloadURL(video.value.guid)
	// lObj(videoURL)
	// const stream = await fapi.video.download(video.value.guid)
	// stream.pipe(fs.createWriteStream('test.mp4'))
})();
