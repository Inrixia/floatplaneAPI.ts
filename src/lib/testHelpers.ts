import { FileCookieStore } from "tough-cookie-file-store";
import { CookieJar, Store } from "tough-cookie";

import Auth from "../auth";
import got from "got";

import { username, password, token } from "./credentials.json";

export const prepCookieJar = async (): Promise<CookieJar> => {
	const cookieStore = new FileCookieStore("./cookieStore.json");
	// TODO: Remove type fix once types are updated for "tough-cookie-file-store"
	const cookieJar = new CookieJar(cookieStore as unknown as Store);
	if (cookieStore.isEmpty()) {
		const fAuth = new Auth(got.extend({ cookieJar }));
		if ((await fAuth.login(username, password)).needs2FA) {
			await fAuth.factor(token);
		}
	}
	return cookieJar;
};