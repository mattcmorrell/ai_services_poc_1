const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3334;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  // Save endpoint
  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync(
          path.join(ROOT, 'product-decisions.json'),
          JSON.stringify(data, null, 2) + '\n'
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Static file serving
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/decision-journal.html';
  let filePath = path.join(ROOT, urlPath);

  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath += '.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Decision journal server running at http://localhost:${PORT}`);
});
