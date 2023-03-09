export enum HttpMethod {
	GET = "get",
	HEAD = "head",
	POST = "post",
	PUT = "put",
	DELETE = "delete",
	CONNECT = "connect",
	OPTIONS = "options",
	TRACE = "trace",
	PATCH = "patch",
}

export type Primitive = string | boolean | number;
export type Query = Record<string, Primitive | Array<Primitive>>;

function buildQueryParams(queryObject: Query): string {
	const searchParams = new URLSearchParams("");

	Object.entries(queryObject).forEach((e) => {
		searchParams.set(e[0], e[1].toString());
	});

	const queryString = searchParams.toString();

	return queryString !== "" ? `?${queryString}` : "";
}

function cleanUrl(url: string): string {
	const newUrl = new URL(url).toString().split("?")[0];

	if (newUrl.slice(-1) === "/") {
		return newUrl.slice(0, -1);
	}

	return newUrl;
}

export type RequestConfig = Omit<
	RequestInit & {
		timeout?: number;
		query?: Query;
	},
	"url"
>;

export async function doRequest<T>(url: string, requestConfig: RequestConfig): Promise<T> {
	const { timeout = 0, query = {}, ...requestInit } = requestConfig;

	const controller = new AbortController();
	let requestTimeout: number | NodeJS.Timeout = 0;

	if (timeout > 0) {
		requestTimeout = setTimeout(() => controller.abort(), timeout);
	}

	const cleanedURL = cleanUrl(url);
	const queryString = buildQueryParams(query);

	return fetch(`${cleanedURL}${queryString}`, {
		...requestInit,
		signal: controller.signal,
	})
		.then(async (response) => {
			if (requestTimeout) {
				clearTimeout(requestTimeout);
			}

			const bodyAsJson = (await response.json()) as T;

			if (response.ok) {
				return bodyAsJson;
			}

			throw new Error(`HTTP ERROR[${response.status}]: ${JSON.stringify(bodyAsJson)}`);
		})
		.catch((error: unknown) => {
			if (controller.signal.aborted) {
				throw new Error(`The request exceeds the timeout of [${timeout}]s`);
			}

			throw error;
		});
}
