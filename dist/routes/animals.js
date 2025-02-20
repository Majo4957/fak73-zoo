import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getPool } from "../lib/client.js";
export const routerAnimal = new Hono();
routerAnimal.get("/", async (c) => {
    const queryResult = await getPool().query('SELECT * FROM "Tier"');
    return c.json(queryResult.rows);
});
routerAnimal.post("/", async (c) => {
    const requestAnimal = await c.req.json();
    const foodCost = Number(requestAnimal.foodCost) || 0.0;
    const text = `INSERT INTO "Tier"(verpflegungskosten, name, geschlecht, art) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
        foodCost,
        requestAnimal.name,
        requestAnimal.gender,
        requestAnimal.kind,
    ];
    const response = await getPool().query(text, values);
    return c.json(response.rows);
});
// POST /animals/1/assign-compound?compoundId=1
// export async function assignAnimal(c: Context)
routerAnimal.post("/animals/1/assign-compound?compoundId=1", async (c) => {
    const pool = getPool();
    const animalId = Number(c.req.param("id"));
    if (isNaN(animalId)) {
        throw new HTTPException(400, {
            message: "Animal id must be of type integer",
        });
    }
    const animalQueryResult = await pool.query('SELECT * FROM "Tier" WHERE Id = $1', [animalId]);
    if (animalQueryResult.rowCount === 0) {
        throw new HTTPException(404, {
            message: `Animal with id ${animalId} does not exist!`,
        });
    }
    const compoundId = Number(c.req.query("compoundId"));
    if (isNaN(compoundId)) {
        throw new HTTPException(400, {
            message: "Query paramter compoundId is required and must be of type integer",
        });
    }
    const compoundQueryResult = await pool.query('SELECT * FROM "Gehege" WHERE Id = $1', [compoundId]);
    if (compoundQueryResult.rowCount === 0) {
        throw new HTTPException(404, {
            message: `Compound with id ${compoundId} does not exist!`,
        });
    }
    const updateResult = await pool.query('UPDATE "Tier" SET gehege_id = $1 WHERE id = $2 RETURNING *', [compoundId, animalId]);
    return c.json(updateResult.rows);
});
