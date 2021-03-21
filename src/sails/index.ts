import { CookieJar } from "tough-cookie";

import socketIOClient from "socket.io-client";

import sailsIOClient from "sails.io.js";
import type SailsIOJS from "sails.io.js";

import { EventEmitter } from "events";

import type { Image, Metadata } from "../lib/types";

export type ConnectResponse = { message: string };

export type CreatorMenuUpdate = {
	event: "creatorMenuUpdate";
	id: string;
	guid: string;
	title: string;
	text: string;
	type: string;
	attachmentOrder: Array<string>;
	metadata: Metadata;
	releaseDate: string;
	likes: number;
	dislikes: number;
	score: number;
	comments: number;
	creator: string;
	thumbnail: Image;
};

export type PostRelease = {
	event: "postRelease";
	data: {
		id: string;
		message: string;
		url: string;
		title: string;
		post: {
			id: string;
			guid: string;
			title: string;
			text: string;
			type: string;
			attachmentOrder: Array<string>;
			metadata: Metadata;
			releaseDate: string | null;
			likes: number;
			dislikes: number;
			score: number;
			comments: number;
			creator: string;
			thumbnail: Image;
		};
		video: {
			id: string;
			guid: string;
			creator: {
				createdAt: string;
				updatedAt: string;
				id: string;
				urlname: string;
				title: string;
				description: string;
				about: string;
				visibility: string;
				subscriberCountDisplay: string;
				incomeDisplay: boolean;
				discoverable: boolean;
				transcodingPriority: string;
				owner: string;
				category: string;
				iconImage: string;
				coverImage: string;
				cardImage: string;
				liveStream: string;
				customCreatorAgreement: string;
				profileImageUrl: string;
			};
			description: string;
		};
		icon: string;
	};
};

export type SyncEvent = CreatorMenuUpdate | PostRelease;

declare interface Sails {
	on(event: "syncEvent", listener: (syncEvent: SyncEvent) => void): this;
}

class Sails extends EventEmitter {
	private cookieJar: CookieJar;
	private io: SailsIOJS.Client;

	constructor(cookieJar: CookieJar) {
		super();
		this.cookieJar = cookieJar;
		this.io = sailsIOClient(socketIOClient);
		this.io.socket.on("syncEvent", data => this.emit("syncEvent", data));
	}

	get cookie(): string {
		return this.cookieJar.toJSON().cookies.reduce((cookies, cookie) => `${cookies}${cookie.key}=${cookie.value}; `, "");
	}

	connect(): Promise<ConnectResponse> {
		this.io.sails.initialConnectionHeaders = {
			Origin: "https://www.floatplane.com",
			cookie: this.cookie,
		};
		this.io.sails.url = "https://www.floatplane.com";	
		return new Promise((resolve, reject) => {
			this.io.socket.post("/api/sync/connect", {}, (data, res) => {
				if (res.statusCode === 200) resolve(data);
				else reject(data);
			});
		});
	}
}
export default Sails;