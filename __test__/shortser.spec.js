const { request } = require("express");
const supertest = require("supertest");
const { server, db } = require("../server");

const initializeDatabase = async () => {
  db.set("shortcodes", [
    {
      shortcode: "boogle",
      url: "https://www.google.com/",
      createdAt: "14/12/2020 13:20",
      lastAccess: "14/12/2020 13:31",
      counter: 0,
    },
    {
      shortcode: "videos",
      url: "https://www.youtube.com/",
      createdAt: "14/12/2020 13:20",
      lastAccess: "12/12/2020 15:31",
      counter: 5,
    },
  ]).write();
};

describe("Testing the shortster API", () => {
  beforeAll(() => {
    initializeDatabase();
  });

  test("GET /:shortcode redirects user to url", async () => {
    // NOTE - Since it can't be redirected we'll expect a 302 for found
    // instead of 200
    await supertest(server).get("/boogle/").expect(302);
  });

  test("GET /:shortcode/stats sends user the shortcode stats", async () => {
    await supertest(server).get("/videos/stats/").expect(200, {
      shortcode: "videos",
      url: "https://www.youtube.com/",
      createdAt: "14/12/2020 13:20",
      lastAccess: "12/12/2020 15:31",
      counter: 5,
    });
  });

  test("POST /addShortcode add shortcode with shortcode in body", async () => {
    const response = await supertest(server).post("/addShortcode").send({
      url: "test",
      shortcode: "testCode",
    });

    expect(response.status).toBe(200);
  });

  test("POST /addShortcode add shortcode with less than 4 characters", async () => {
    const response = await supertest(server).post("/addShortcode").send({
      url: "test",
      shortcode: "tes",
    });

    expect(response.status).toBe(400);
  });

  test("POST /addShortcode add shortcode that already exists", async () => {
    const response = await supertest(server).post("/addShortcode").send({
      url: "test",
      shortcode: "testCode",
    });

    expect(response.status).toBe(409);
  });

  test("POST /addShortcode without shortcode in body", async () => {
    const response = await supertest(server).post("/addShortcode").send({
      url: "test",
    });

    expect(response.status).toBe(200);
  });

  test("POST /addShortcode without shortcode in body and get shortcode with 6 characters", async () => {
    const response = await supertest(server).post("/addShortcode").send({
      url: "test",
    });

    expect(response.body.shortcode.length === 6);
    expect(response.status).toBe(200);
  });

  afterAll((done) => {
    db.set("shortcodes", []).write();
    server.close();
    done();
  });
});
