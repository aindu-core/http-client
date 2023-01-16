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
		output?: (obj: unknown) => unknown;
	};
};

export type MakeRequestConfig = RequestConfig & { retries?: number };

export class HttpClient {
	constructor(private readonly config: HttpClientConfig = {} as HttpClientConfig) {}

	async makeRequest<T>(url: string, requestConfig: MakeRequestConfig): Promise<T> {
		const { retries = this.config.retries ?? 0 } = requestConfig;
		const fullUrl = this.config.basePath ? `${this.config.basePath}${url}` : url;

		const reqConfig = {
			...this.defaultOptions(),
			...requestConfig,
		};

		if (!!this.config.serialization?.input && !!reqConfig.body) {
			reqConfig.body = this.config.serialization.input(reqConfig.body) as BodyInit;
		}

		try {
			const response = await doRequest<T>(fullUrl, reqConfig);

			if (this.config.serialization?.output) {
				return this.config.serialization.output(response) as T;
			}

			return response;
		} catch (error: unknown) {
			if (retries > 0) {
				return this.makeRequest<T>(url, {
					...requestConfig,
					retries: retries - 1,
				});
			}
			throw error;
		}
	}

	async get<T>(url: string, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, { method: HttpMethod.GET, ...options });
	}

	async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.POST,
			body: JSON.stringify(body),
			...options,
		});
	}

	async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.PUT,
			body: JSON.stringify(body),
			...options,
		});
	}

	async delete<T>(url: string, options?: RequestOptions): Promise<T> {
		return this.makeRequest<T>(url, {
			method: HttpMethod.DELETE,
			...options,
		});
	}

	async patch<T>(url: string, body: unknown, options?: RequestOptions): Promise<T> {
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
