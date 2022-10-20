import { once } from "events";
import * as cp from "node:child_process";

const server = cp.spawn("node", ["server.js"]);
const port = 5000;

const message = await Promise.race([
  once(server.stdout, "data"),
  Promise.race([
    once(server.stderr, "data").then(String).then(Error),
    once(server, "error"),
  ]).then((x) => Promise.reject(x)),
]);

// check the 1st log: for example if they specified the PORT
message[0].toString("utf8");

const sendRequest = async (path, options) => {
  const response = await fetch(`http://localhost:${port}${path}`, options);
  // return an object
  const { status, statusText, ok } = response;
  const headers = Object.fromEntries(response.headers);
  const body = await response.text();
  return { status, body, headers };
};

// tests here

await sendRequest("/db/mario12.json", {
  method: "GET",
});
await sendRequest("/db/mario1.json", {
  method: "GET",
});
await sendRequest("/db/mario1.json", {
  method: "POST",
  body: "123",
});

server.kill("SIGQUIT");
