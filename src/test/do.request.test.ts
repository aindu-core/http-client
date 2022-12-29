import { doRequest, HttpMethod, TimeoutError } from "../main/do.request";

describe("doRequest Test Suite", () => {
	test("making request without any config should response correctly", async () => {
		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({}),
			ok: true,
		});

		const response = await doRequest("http://www.test.com/pepe", {
			method: HttpMethod.GET,
		});

		expect(fetch).toBeCalled();
		expect(response).toEqual({});
	});

	test.skip("making request with timeout of 100ms should throw TimeoutError", async () => {
		global.fetch = jest.fn().mockResolvedValueOnce({
			// eslint-disable-next-line no-promise-executor-return
			json: () => new Promise((resolve) => setTimeout(() => resolve({}), 140)),
			ok: false,
			status: 500,
		});

		try {
			await doRequest("http://www.test.com/pepe", {
				method: HttpMethod.GET,
				timeout: 100,
			});

			fail("Test shoueld be failed");
		} catch (error: unknown) {
			expect(fetch).toBeCalled();
			expect(error).toBeInstanceOf(TimeoutError);
		}
	});

	test("making request with quert params should response correctly", async () => {
		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({}),
			ok: true,
		});

		const query = {
			first: "first",
			second: "second",
		};

		await doRequest("http://www.test.com/pepe", {
			query,
			method: HttpMethod.GET,
		});

		expect(fetch).toHaveBeenCalledWith(
			"http://www.test.com/pepe?first=first&second=second",
			expect.anything()
		);
	});

	test("making request without any config should fails", async () => {
		global.fetch = jest.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({}),
			ok: false,
		});

		try {
			await doRequest("http://www.test.com/pepe", {
				method: HttpMethod.GET,
			});

			fail("Test shoueld be failed");
		} catch (error: unknown) {
			expect(fetch).toHaveBeenCalledWith("http://www.test.com/pepe", {
				method: HttpMethod.GET,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				signal: expect.anything(),
			});
			expect(error).toBeInstanceOf(Error);
		}
	});
});
