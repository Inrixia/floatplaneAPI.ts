import got from "got";

type Got = typeof got;
export class Core {
	protected got: Got;
	constructor(got: Got) {
		this.got = got;
	}
}
