import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | undefined = undefined;

export function getPool() {
  if (pool) {
    return pool
  }

  pool = new Pool({
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return pool;
}
