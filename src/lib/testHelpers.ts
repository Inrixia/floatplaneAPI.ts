import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar, Store } from "tough-cookie";

import Auth from "../auth";
import got from "got";

import { username, password, token } from "./credentials.json";

export const prepCookieJar = async (): Promise<CookieJar> => {
	const cookieStore = new FileCookieStore("./cookieStore.json");
	// TODO: Remove type fix once types are updated for "tough-cookie-file-store"
	const cookieJar = new CookieJar(cookieStore as unknown as Store);
	await new Promise<void>((res, rej) => cookieStore.getAllCookies(async (err, cookies) => {
		if (err) rej(err);
		if (cookies.length === 0) {
			const fAuth = new Auth(got.extend({ cookieJar }));
			if ((await fAuth.login(username, password)).needs2FA) {
				await fAuth.factor(token);
			}
		}
		res();
	}));
	return cookieJar;
};

import type { Image, ChildImage } from "../types";
export const imageFormat: Image = {
	width: expect.any(Number),
	height: expect.any(Number),
	path: expect.any(String),
	childImages: expect.arrayContaining<ChildImage>([
		expect.objectContaining<ChildImage>({
			width: expect.any(Number),
			height: expect.any(Number),
			path: expect.any(String)
		})
	])
};