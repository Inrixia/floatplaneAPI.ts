import got from "got";

type Got = typeof got;
export class Core {
	public got: Got;
	protected readonly BaseUrl = "https://www.floatplane.com";
	constructor(got: Got) {
		this.got = got;
	}
}
