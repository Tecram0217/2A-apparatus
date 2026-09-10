const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = 4174;
const types = {
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.png':'image/png'
};

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control':'no-store'
    });
    response.end(data);
  });
});

server.on('error', error => {
  console.error(error.message);
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`CODE:2A device edition http://127.0.0.1:${port}`);
});
