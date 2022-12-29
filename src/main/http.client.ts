import { doRequest, HttpMethod, RequestConfig } from "./do.request";
import { WithoutBodyField } from "./types";

export type RequestOptions = WithoutBodyField<RequestConfig> & {
	retries?: number;
};

export type HttpClientConfig = {
	timeout?: number;
	retries?: number;
	basePath?: string;
	serialization?: {
		input?: (obj: unknown) => unknown;
		outout?: (obj: unknown) => unknown;
	};
};

export class HttpClient {
	private readonly config: HttpClientConfig;

	constructor(clientConfig?: HttpClientConfig) {
		this.config = clientConfig ?? {};
	}

	async makeRequest<T = unknown>(
		url: string,
		requestConfig: RequestConfig & { retries?: number }
	): Promise<T> {
		const { retries = this.config.retries ?? 0 } = requestConfig;
		const fullUrl = this.config.basePath ? `${this.config.basePath}${url}` : url;

		return doRequest<T>(fullUrl, {
			...this.defaultOptions(),
			...requestConfig,
		}).catch((e: unknown) => {
			if (retries > 0) {
				return this.makeRequest<T>(url, {
					...requestConfig,
					retries: retries - 1,
				});
			}
			throw e;
		});
	}

	async get<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, { method: HttpMethod.GET, ...options });
	}

	async post<T = unknown>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.POST,
			body: JSON.stringify(body),
			...options,
		});
	}

	async put<T = unknown>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.PUT,
			body: JSON.stringify(body),
			...options,
		});
	}

	async delete<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.DELETE,
			...options,
		});
	}

	async patch<T = unknown>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.PATCH,
			body: JSON.stringify(body),
			...options,
		});
	}

	private defaultOptions(): RequestOptions {
		const { timeout, retries } = this.config;
		const options: RequestOptions = {};

		if (timeout) {
			options.timeout = timeout;
		}

		if (retries) {
			options.retries = retries;
		}

		return options;
	}
}
