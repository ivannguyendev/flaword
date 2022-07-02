const express = require("express");
const { Flaword } = require("../dist");

const app = express();

function createError(code = 400, msg = "bad request", options = {}) {
  const error = Error(msg);
  Object.assign(error, { ...options, code: code });
  return error;
}

// Use: http://localhost:3000/?filter=helloword
app.use((req, res, next) => {
  const queryFlaw = Flaword.check(req.query, { blacklist: ["helloword"] });
  if (queryFlaw.isFlaw) {
    throw new createError(422, `${queryFlaw.key} validation failed`);
  }
  next();
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.code).send({ ...err, message: err.message });
  }
});

app.listen(3000);
