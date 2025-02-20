import pg from "pg";
const { Pool } = pg;
let pool = undefined;
export function getPool() {
    if (pool) {
        return pool;
    }
    pool = new Pool({
        ssl: {
            rejectUnauthorized: false,
        },
    });
    return pool;
}
