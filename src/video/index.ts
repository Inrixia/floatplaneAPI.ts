import Core from "../Core";

import type Request from "got/dist/source/core";

import type { Options } from "got/dist/source/core";
export type GotOptions = Options & { isStream: true };

export default class Video extends Core {
	endpoints = {
		url: "https://www.floatplane.com/api/video/url?guid=%guid%&quality=%quality%"
	}

	/**
	 * Gets the URL to download a video
	 * @param {string} videoGUID GUID of video
	 * @param videoQuality Quality wanted
	 * @returns Video download URL
	 */
	url = async (videoGUID: string, videoQuality="360"): Promise<string> => JSON.parse(await this.got(this.endpoints.url.replace("%guid%", videoGUID).replace("%quality%", videoQuality), { resolveBodyOnly: true })).replace(/\/chunk.m3u8/, "")

	/**
	 * Downloads a video
	 * @param {string} videoGUID GUID of video
	 * @param videoQuality Quality wanted
	 * @returns Stream containing video data and events: https://github.com/sindresorhus/got#streams-1
	 * @example
	 * const fs = require('fs')
	 * const stream = await download("jImMbJ2pbE", "360")
	 * stream.pipe(fs.createWriteStream('video.mp4')) // Saves video to 'video.mp4'
	 */
	download = async (videoGUID: string, videoQuality="360", gotOptions: GotOptions = { isStream: true }): Promise<Request> => this.got.stream(await this.url(videoGUID, videoQuality), gotOptions)
}