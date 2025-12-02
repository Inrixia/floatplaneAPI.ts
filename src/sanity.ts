import { Floatplane, version } from "./index.js";
const fApi = new Floatplane({ tokenSet: null, clientSettings: { server: "https://auth.floatplane.com/realms/floatplane-pp", clientId: "floatplane-downloader"} }, "test", "https://pp.floatplane.com"); // Create a new API instance.

// console.log(await fApi.deviceLogin());

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Yes, package.json isnt under src, this is fine
import pkg from "../package.json" with { type: "json" };

if (pkg.version !== version) throw new Error(`Version mismatch! package.json says ${pkg.version} but index says ${version}`);
