// import { Router } from "https://deno.land/x/oak/mod.ts";
import { hmac } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";
import makeJwt from "https://deno.land/x/djwt/create.ts";
import validateJwt from "https://deno.land/x/djwt/validate.ts";
import db from "./db.ts";

// jwt config
const jwtKey = "abc123";

const jwtHeader = {
  alg: "HS512",
  typ: "JWT"
};

// hashing config
const secureKey = "1234567890";
const hash = password => hmac("sha256", secureKey, password, "utf8", "hex");

export const validateToken = async token => {
  return await validateJwt(token, jwtKey, false);
};

// export const authRouter = new Router();

export const login = async context => {
  const {
    value: { login, password }
  } = await context.request.body();
  const hashPassword = hash(password);
  const existingAccount = db.accounts.find(
    acc => acc.login === login && acc.password === hashPassword
  );
  if (existingAccount) {
    const jwt = makeJwt(jwtHeader, { login }, jwtKey);
    context.response.body = JSON.stringify({ login, jwt, success: true });
  } else {
    context.response.body = JSON.stringify({
      success: false,
      error: "Login Failed"
    });
  }
};

export const register = async context => {
  const {
    value: { login, password }
  } = await context.request.body();
  const jwt = makeJwt(jwtHeader, { login }, jwtKey);
  const hashedPassword = hash(password);
  db.accounts.push({ login, password: hashedPassword });
  context.response.body = JSON.stringify({ login, success: true });
};

// authRouter.post("/login", login).post("/register", register);

export const setupAuth = router => {
  router.post("/login", login).post("/register", register);
  return router;
};

// both success
// curl --header "Content-Type: application/json" \
// --request POST \
// --data '{"login":"test","password":"123"}' \
// http://localhost:8000/register

// curl --header "Content-Type: application/json" \
// --request POST \
// --data '{"login":"test","password":"123"}' \
// http://localhost:8000/login

// curl --header "Content-Type: application/json" \
// --header: "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QifQ.d1dzQRQi06OVdA1gfF-YdVUVw1qAo5Ls9vMp4PQ93il4vKklm8o0yuvhizWs3v3PKaYgcTjBk768uMWhaN-g1g" \
// http://localhost:8000/protected
