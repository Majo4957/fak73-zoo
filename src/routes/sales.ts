import { Hono } from "hono";
import { getPool } from "../lib/client.js";

export const routerSales = new Hono();

routerSales.get("/", async (c) => {
  const queryResult = await getPool().query('SELECT * FROM "Verkaufsstand"');
  return c.json(queryResult.rows);
});

routerSales.post("/", async (c) => {
  const requestSales = await c.req.json();
  const text = `INSERT INTO "Verkaufsstand"(produktart, profit) VALUES ($1,$2,$3) RETURNING *`;
  const values = [requestSales.kind, requestSales.profit];
  const response = await getPool().query(text, values);
  return c.json(response.rows);
});
