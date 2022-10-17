import * as cp from "node:child_process";
import { promisify } from "node:util";

// Start server

const port = 5000;

const sendRequest = async (path, options) => {
  try {
    const response = await fetch(`http://localhost:${port}${path}`, options);
    console.log("--- Check status code:");
    console.log(response.status);
    console.log(response.statusText);
    if (response.ok) {
      console.log("--- Response:");
      try {
        console.log(await response.json());
      } catch (err) {
        console.log("Need to check server ...");
        console.log(err);
      }
    }
  } catch (err) {
    console.log("--- Something bad happened");
    console.log(err);
  }
};

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

// Shutdown server
