import type { Got } from "got/dist/source/types";

export class Core {
	protected got: Got
	constructor(got: Got) {
		this.got = got;
	}
}