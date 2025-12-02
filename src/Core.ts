import got from "got";

type Got = typeof got;
export class Core {
	public got: Got;
	protected baseUrl;
	public static readonly BaseUrl = "https://www.floatplane.com";
	constructor(got: Got, baseUrl?: string) {
		this.got = got;
		this.baseUrl = baseUrl ?? Core.BaseUrl;
	}
}
