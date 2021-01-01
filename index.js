const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");
const overviewTemplate = fs.readFileSync(
  `${__dirname}/frontEnd/overviewTemplate.html`,
  "utf-8"
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/frontEnd/cardTemplate.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/frontEnd/productTemplate.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/devData/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardTemplate, el))
      .join("");
    const output = overviewTemplate.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemplate, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
