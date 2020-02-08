import { Router } from "https://deno.land/x/oak/mod.ts";
import { hmac } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";
import db from "./db.ts";

const secureKey = "1234567890";
const hash = password => hmac("sha256", secureKey, password, "utf8", "hex");

export const authRouter = new Router();
authRouter
  .post("/login", async context => {
    const {
      value: { login, password }
    } = await context.request.body();
    const hashPassword = hash(password);
    const existingAccount = db.accounts.find(
      acc => acc.login === login && acc.password === hashPassword
    );
    if (existingAccount) {
      context.response.body = JSON.stringify({ login, success: true });
    } else {
      context.response.body = JSON.stringify({
        success: false,
        error: "Login Failed"
      });
    }
  })
  .post("/register", async context => {
    const {
      value: { login, password }
    } = await context.request.body();
    const hashPassword = hash(password);
    db.accounts.push({ login, password: hashPassword });
    context.response.body = JSON.stringify({ login, success: true });
  });

// both success
// curl --header "Content-Type: application/json" \
// --request POST \
// --data '{"login":"test","password":"123"}' \
// http://localhost:8000/register

// curl --header "Content-Type: application/json" \
// --request POST \
// --data '{"login":"test","password":"123"}' \
// http://localhost:8000/login
