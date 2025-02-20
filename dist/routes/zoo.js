import { Hono } from "hono";
import { getPool } from "../lib/client.js";
export const routerZoo = new Hono();
routerZoo.get("/", async (c) => {
    const queryResult = await getPool().query('SELECT * FROM "Zoo"');
    return c.json(queryResult.rows);
});
routerZoo.post("/", async (c) => {
    const requestZoo = await c.req.json();
    const text = `INSERT INTO "Zoo"(eintrittspreis, kontostand) VALUES ($1,$2,$3) RETURNING *`;
    const values = [requestZoo.price, requestZoo.balance];
    const response = await getPool().query(text, values);
    return c.json(response.rows);
});
