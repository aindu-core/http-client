import { HttpMethod } from "../main/do.request";
import { HttpClient } from "../main/http.client";

describe("HttpClient Test Suite", () => {
	test("should create a new instance without errors and default config", () => {
		const client = new HttpClient();
		expect(client).toBeDefined();
	});

	test("should can send get request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ status: "GET OK" }),
			ok: true,
		});

		const response = await client.get<{ status: string }>("http://www.test.com");

		expect(response).toEqual({ status: "GET OK" });
	});

	test("should can send delete request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ status: "DELETE OK" }),
			ok: true,
		});

		const response = await client.delete<{ status: string }>("http://test.com/resource/1");

		expect(response).toEqual({ status: "DELETE OK" });
	});

	test("should can send put request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ status: "PUT OK" }),
			ok: true,
		});

		const response = await client.put<{ status: string }>("http://test.com/test/1", {
			field: "new value",
		});

		expect(response).toEqual({ status: "PUT OK" });
	});

	test("should can send patch request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ status: "PATCH OK" }),
			ok: true,
		});

		const response = await client.patch<{ status: string }>("http://test.com", {
			field: "new value",
		});

		expect(response).toEqual({ status: "PATCH OK" });
	});

	test("should can send post request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ status: "POST OK" }),
			ok: true,
		});

		const response = await client.post<{ status: string }>("http://test.com", {
			field: "field",
		});

		expect(response).toEqual({ status: "POST OK" });
	});

	test("should fails sending get request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.reject(new Error("GET fails")),
			ok: false,
		});

		try {
			await client.get<{ status: string }>("http://www.test.com");

			fail("Test should be failed");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("GET fails");
		}
	});

	test("should fails sending delete request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.reject(new Error("DELETE fails")),
			ok: false,
		});

		try {
			await client.delete<{ status: string }>("http://test.com/resource/1");

			fail("Test should be failed");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("DELETE fails");
		}
	});

	test("should fails sending put request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.reject(new Error("PUT fails")),
			ok: false,
		});

		try {
			await client.put<{ status: string }>("http://test.com/test/1", {
				field: "new value",
			});

			fail("Test should be failed");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("PUT fails");
		}
	});

	test("should can send patch request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.reject(new Error("PATCH fails")),
			ok: false,
		});

		try {
			await client.patch<{ status: string }>("http://test.com", {
				field: "new value",
			});

			fail("Test should be failed");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("PATCH fails");
		}
	});

	test("should can send post request correctly with default config", async () => {
		const client = new HttpClient();

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.reject(new Error("POST fails")),
			ok: false,
		});

		try {
			await client.post<{ status: string }>("http://test.com", {
				field: "field",
			});

			fail("Test should be failed");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("POST fails");
		}
	});

	test("should retry 2 times the request before throw exception", async () => {
		const client = new HttpClient({ retries: 2 });

		global.fetch = jest.fn().mockResolvedValue({
			json: () => Promise.reject(new Error("GET fails")),
			ok: false,
		});

		try {
			await client.get<{ status: string }>("http://test.com");

			fail("Test should be failed");
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("GET fails");
			expect(fetch).toBeCalledTimes(3);
		}
	});

	test("should can send post request correctly with serialization config", async () => {
		const serialization = {
			input: jest.fn().mockReturnValue({ complex_field_name: "Complex Field Name" }),
			output: jest.fn().mockReturnValue({ apiStatus: "POST OK" }),
		};

		const client = new HttpClient({
			serialization,
		});

		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ api_status: "POST OK" }),
			ok: true,
		});

		const response = await client.post<{ status: string }>("http://test.com", {
			complexFieldName: "Complex Field Name",
		});

		expect(fetch).toBeCalledWith("http://test.com", {
			body: { complex_field_name: "Complex Field Name" },
			method: HttpMethod.POST,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			signal: expect.anything(),
		});

		expect(response).toEqual({ apiStatus: "POST OK" });
	});
});
