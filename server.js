import http from "node:http";
import fs from "node:fs/promises";

const retrievePostData = async (req) => {
  const data = [];
  for await (const chunk of req) {
    data.push(chunk.toString("utf-8"));
  }
  return data;
};

const handleGet = async (req, res) => {
  try {
    res.writeHead(200, { "content-type": "application/json" });
    const response = await fs.readFile(`.${req.url}`);
    const content = await JSON.parse(response);
    res.write(JSON.stringify(await content));
  } catch (err) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.write(res.statusMessage); // how to change text here?
  }
};

const handlePost = async (req, res) => {
  if (req.headers["content-length"]) {
    res.writeHead(200, { "content-type": "plain/text" })
    const data = await retrievePostData(req);
    console.log(data);
    res.write("Received data!");
  } else {
    res.write("Nothing interesting ...");
  }
}

const port = 5000;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    await handleGet(req, res);
  }
  if (req.method === "POST") {
    await handlePost(req, res);
  }
  res.end();
});

server.listen(port, (err) => {
  if (err) {
    process.exit(1);
    console.error(err);
  } else {
    console.log(`Listening on ${port}...`);
  }
});
