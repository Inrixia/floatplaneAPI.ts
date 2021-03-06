import { CookieJar } from "tough-cookie";

import socketIOClient from "socket.io-client";

import sailsIOClient from "sails.io.js";
import type SailsIOJS from "sails.io.js";

import { EventEmitter } from "events";

import type { Image, Metadata } from "../lib/types";

export type NotLoggedInError = {
	id: string;
	name: "notLoggedInError";
	message: "You must be logged-in to access this resource.";
}
export type ConnectNotLoggedIn = {
	id: string;
	errors: NotLoggedInError;
	message: NotLoggedInError["message"];
}

export type ConnectSuccess = {
	id: undefined,
	message: string,
	errors: undefined
};

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

export declare interface Sails {
	on(event: "syncEvent", listener: (syncEvent: SyncEvent) => void): this;
}

export class Sails extends EventEmitter {
	private cookieJar: CookieJar;
	private io?: SailsIOJS.Client;

	constructor(cookieJar: CookieJar) {
		super();
		this.cookieJar = cookieJar;
	}

	private get cookie(): string {
		return this.cookieJar.toJSON().cookies.reduce((cookies, cookie) => `${cookies}${cookie.key}=${cookie.value}; `, "");
	}

	private login = (): void => {
		this.io = sailsIOClient(socketIOClient);

		this.io.sails.initialConnectionHeaders = {
			Origin: "https://www.floatplane.com",
			cookie: this.cookie,
		};
		this.io.sails.url = "https://www.floatplane.com";

		this.io.socket.on("syncEvent", data => this.emit("syncEvent", data));

		// Attempt to reconnect if socket disconnects
		this.io.socket.on("disconnect", () => setTimeout(this.connect, 1000));
	}

	/**
	 * Subscribe to syncEvents
	 */
	connect = (): Promise<ConnectSuccess> => new Promise((resolve, reject) => {
		if (this.io === undefined) this.login();
		if (this.io === undefined) throw new Error("Unable to login to floatplane sails!");

		if (!this.io.socket.isConnecting() && !this.io.socket.isConnected() && !this.io.socket.mightBeAboutToAutoConnect()) this.io.socket.reconnect();
		this.io.socket.post("/api/sync/connect", {}, (data: ConnectSuccess, res) => {
			if (res.statusCode === 200 && data.errors === undefined) resolve(data);
			reject(data);
		});
	});
}