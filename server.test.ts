const app = require("./index");
const request = require("supertest");
jest.useFakeTimers();

describe("fetching Git Hub repo service test", () => {
  beforeAll(() => {
    process.env.PORT = "7000";
    process.env.CREATION_DATE = "2022-01-01";
  });
  test("It should response the GET method", async () => {
    // we don't mock the GET request in the Github endpoint, so
    // no content is returned, hence the error
    const response = await request(app).get("/getRepos").query({ limit: "50" });
    expect(response.statusCode).toBe(404);
  });
});
