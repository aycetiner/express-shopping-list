process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let items = require("../fakeDb");

let item = { name: "silly", price: 200 };

beforeEach(async () => {
  items.push(item);
});

afterEach(async () => {
  items = [];
});
// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", function () {
  test("Gets a list of items", async function () {
    const response = await request(app).get(`/items`);
    const { items } = response.body;
    expect(response.statusCode).toBe(200);
    expect(items).toHaveLength(1);
  });
});
// end

/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /items/:name", function () {
  test("Gets a single item", async function () {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(item);
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).get(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});
// end

/** POST /items - create item from data; return `{item: item}` */

describe("POST /items", function () {
  test("Creates a new item", async function () {
    const response = await request(app).post(`/items`).send({
      name: "Taco",
      price: 3.0,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.added).toHaveProperty("name");
    expect(response.body.added).toHaveProperty("price");
    expect(response.body.added.name).toEqual("Taco");
    expect(response.body.added.price).toEqual(3.0);
  });
});
// end

/** PATCH /items/[name] - update item; return `{item: item}` */

describe("PATCH /items/:name", function () {
  test("Updates a single item", async function () {
    const response = await request(app).patch(`/items/${item.name}`).send({
      name: "Troll",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.updated.name).toEqual("Troll");
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).patch(`/items/0`).send({
      name: "Pickles",
      price: 3.55,
    });
    expect(response.statusCode).toBe(404);
  });
});
// end

/** DELETE /items/[name] - delete item,
 *  return `{message: "item deleted"}` */

describe("DELETE /items/:name", function () {
  test("Deletes a single a item", async function () {
    const response = await request(app).delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" });
  });
});
// end
