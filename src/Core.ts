import got from "got";

type Got = typeof got;
export class Core {
	public got: Got;
	protected BaseUrl = "https://www.floatplane.com";
	constructor(got: Got, baseUrl?: string) {
		this.got = got;
		if (baseUrl) this.BaseUrl = baseUrl;
	}
}
