import { Hono } from "hono";
import { getPool } from "../lib/client.js";

export const routerCompounts = new Hono();

routerCompounts.get("/", async (c) => {
  const queryResult = await getPool().query('SELECT * FROM "Gehege"');
  return c.json(queryResult.rows);
});

routerCompounts.post("/", async (c) => {
  const requestCompount = await c.req.json();
  const text = `INSERT INTO "Gehege"(name, groesse, kosten) VALUES ($1,$2,$3) RETURNING *`;
  const values = [
    requestCompount.name,
    requestCompount.size,
    requestCompount.cost,
  ];
  const response = await getPool().query(text, values);
  return c.json(response.rows);
});

type patchCompoundBody = {
  name?: string;
  size?: number;
  upkeepCost?: number;
  assignedCaretakers: number[];
};

routerCompounts.patch("/:id", async (c) => {
  const patchBody = (await c.req.json()) as patchCompoundBody;
  const compoundId = c.req.param("id");
  const compoundQueryResult = await getPool().query(
    'SELECT * FROM "Gehege" WHERE id = $1',
    [compoundId]
  );
  const compoundFromDatabase = compoundQueryResult.rows[0];

  const patchObject = {
    name: patchBody.name,
    size: patchBody.size,
    upkeepCost: patchBody.upkeepCost,
  };

  const updateBody = {
    ...compoundFromDatabase,
    ...patchObject,
  };

  const updateText =
    'UPDATE "Gehege" SET name=$1, groesse=$2, kosten=$3 WHERE id=$4';
  const updateValues = [
    updateBody.name,
    updateBody.size,
    updateBody.upkeepCost,
    compoundId,
  ];
  const updateResult = await getPool().query(updateText, updateValues);
  console.log("Update von Gehege Werten: ", updateResult.rows);

  const relationQueryResult = await getPool().query(
    // 'SELECT * FROM ("Gehege" JOIN "Personal_Gehege" On "Gehege".id = "Personal_Gehege".gehege.id)'
    'SELECT * FROM "Personal_Gehege" Where gehege_id =$1',
    [compoundId]
  );

  const insertArray: number[] = [];
  const caretakersIdsInDatabase = relationQueryResult.rows.map(
    (row) => row.personal.id
  );
  patchBody.assignedCaretakers.forEach((id) => {
    if (caretakersIdsInDatabase.includes(id)) {
      getPool().query(
        'INSERT INTO "Personal_Gehege" (gehege_id, tierpfleger_id) VALUES ($1,$2)',
        [compoundId, id]
      );
    }
  });

  const compoundJoin = relationQueryResult.rows;
});
