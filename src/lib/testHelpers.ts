import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar, Store } from "tough-cookie";

// TODO: Remove type fix once types are updated for "tough-cookie-file-store"
export const prepCookieJar = async (): Promise<CookieJar> =>  new CookieJar(new FileCookieStore("./cookieStore.json") as unknown as Store);

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