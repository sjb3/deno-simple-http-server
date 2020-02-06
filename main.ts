import { readJson } from "https://deno.land/std/fs/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
  .get("/", async context => {
    context.response.body = "Are you happy now? Fuckers!";
  })
  .get("/data", async context => {
    context.response.body = await readJson("./data.json");
  })
  .get("/fetch", async ctx => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/ditto/")
      .then(res => res.json())
      .catch(err => console.error(err));
    ctx.response.body = JSON.stringify(res, null, 4);
  });
// .get("/book/:id", context => {
//   if (context.params && books.has(context.params.id)) {
//     context.response.body = books.get(context.params.id);
//   }
// });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen("127.0.0.1: 8000");
