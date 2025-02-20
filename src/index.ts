import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config } from "dotenv";
import { getPool } from "./lib/client.js";
import { routerAnimal } from "./routes/animals.js";
import { routerCompounts } from "./routes/compounts.js";
import { routerPersonal } from "./routes/personal.js";
import { routerSales } from "./routes/sales.js";
import { routerZoo } from "./routes/zoo.js";

config();
const app = new Hono();
app.route("/animals", routerAnimal);
app.route("/component", routerCompounts);
app.route("/personal", routerPersonal);
app.route("/zoo", routerZoo);
app.route("/sales", routerSales);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  }
);
