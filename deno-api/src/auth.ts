import { Router } from "https://deno.land/x/oak/mod.ts";
import db from "./db.ts";

export const authRouter = new Router();
authRouter
  .post("/login", context => {
    context.response.body = "Hello AUTH!";
  })
  .post("/register", context => {
    const { login, password } = context.request.body();
    const hashPassword = hash(password);
    db.account.push({ login, password: hashPassword });
  });
