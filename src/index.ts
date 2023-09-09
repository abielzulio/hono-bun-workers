import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const app = new Hono()

/* Middleware example for calculating response time */
app.use("*", async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set("X-Response-Time", `${end - start}`)
})

/* Return HTML */
app.get("/", (c) => c.html(`<h1>Hi, Hono!</h1>`))

/* Validation for POST method, return as a JSON */
app.post("/user", zValidator("json", z.object({ name: z.string() })), (c) => {
  const { name } = c.req.valid("json")
  return c.json({ name })
})

/* With params, return as a plain text */
app.get("/user/:name", (c) => {
  const name = c.req.param("name")
  return c.text(name)
})

/* 404 example */
app.get("/404", (c) => c.notFound())

/* Redirect example */
app.get("/redirect", (c) => c.redirect("/")) /* Defaul status code: 302 */
app.get("/redirect-permanently", (c) => c.redirect("/", 301))

export default app
