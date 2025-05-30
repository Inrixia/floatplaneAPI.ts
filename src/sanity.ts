import { Floatplane, version } from "./index.js";
new Floatplane(); // Create a new API instance.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Yes, package.json isnt under src, this is fine
import pkg from "../package.json" with { type: "json" };

if (pkg.version !== version) throw new Error(`Version mismatch! package.json says ${pkg.version} but index says ${version}`);
