import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../out/', import.meta.url));
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

const send = async (res, filePath, status = 200) => {
  const data = await readFile(filePath);
  res.writeHead(status, { 'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream' });
  res.end(data);
};

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const filePath = normalize(join(root, relative));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const info = await stat(filePath);
    await send(res, info.isDirectory() ? join(filePath, 'index.html') : filePath);
  } catch {
    try {
      await send(res, join(root, '404.html'), 404);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  }
});

server.listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}`);
});
