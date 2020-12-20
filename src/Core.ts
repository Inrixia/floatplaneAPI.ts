import type { Got } from "got/dist/source/types";

export default class Core {
	private got: Got
	constructor(got: Got) {
		this.got = got;
	}
}