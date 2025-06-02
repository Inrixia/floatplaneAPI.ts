import { CookieJar, type Store } from "tough-cookie";
import { FileCookieStore } from "tough-cookie-file-store";
import { headers } from "../index.js";

export const cookieJar = new CookieJar(<Store>(<any>new FileCookieStore("./cookieStore.json")));
export const gotExtends = () => ({
	cookieJar,
	headers,
});
