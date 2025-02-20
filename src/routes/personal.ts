import { Hono } from "hono";
import { getPool } from "../lib/client.js";

export const routerPersonal = new Hono();

routerPersonal.get("/", async (c) => {
  const queryResult = await getPool().query('SELECT * FROM "Personal"');
  return c.json(queryResult.rows);
});

routerPersonal.post("/", async (c) => {
  const requestPersonal = await c.req.json();
  const text = `INSERT INTO "Personal"(name, rolle, gehalt) VALUES ($1,$2,$3) RETURNING *`;
  const values = [
    requestPersonal.name,
    requestPersonal.role,
    requestPersonal.salary,
  ];
  const response = await getPool().query(text, values);
  return c.json(response.rows);
});
