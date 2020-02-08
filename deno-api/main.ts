import { Application, Router } from "https://deno.land/x/oak/mod.ts";
// import { authRouter } from "./src/auth.ts";
import { setupAuth, validateToken } from "./src/auth.ts";

const router = new Router();

setupAuth(router).get("/", ctx => {
  ctx.response.body = "HOMEPAGE";
});
// main routes
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
// auth routes
// app.use(authRouter.routes());
// app.use(authRouter.allowedMethods());

// Authorization middleware
app.use(async (ctx, next) => {
  const authorization = ctx.request.headers.get("Authorization");
  const token = authorization.replace("Bearer ", "");
  const tokenValid = await validateToken(token);

  if (tokenValid) {
    await next();
    return;
  }

  ctx.response.body = JSON.stringify({ error: "Not authorized" });
});

// Protected Routes
const protectedRouter = new Router();
protectedRouter.get("/protected", context => {
  context.response.body = "Hello protected route!";
});
app.use(protectedRouter.routes());
app.use(protectedRouter.allowedMethods());

app.listen({ port: 8000 });
