const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = process.cwd();
const output = path.join(root, 'dist');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

async function copySiteFiles(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    if (['.git', '.github', 'node_modules', 'dist'].includes(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copySiteFiles(from, to);
    } else if (entry.isFile()) {
      await fs.copyFile(from, to);
    }
  }
}

async function main() {
  const homepage = JSON.parse(await fs.readFile(path.join(root, 'content/homepage.json'), 'utf8'));
  const projects = JSON.parse(await fs.readFile(path.join(root, 'content/projects.json'), 'utf8'));
  if (!Array.isArray(projects) || !projects.length) throw new Error('Project data is empty or invalid.');

  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const requested = path.resolve(root, '.' + pathname);
      if (!requested.startsWith(root + path.sep) && requested !== root) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      const stat = await fs.stat(requested);
      if (!stat.isFile()) throw new Error('Not a file');
      res.writeHead(200, { 'Content-Type': mime[path.extname(requested).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(requested).pipe(res);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${address.port}/index.html`, { waitUntil: 'networkidle', timeout: 90000 });

    await page.waitForFunction(({ homepage, projects }) => {
      const eyebrow = document.querySelector('[data-cms-home="heroEyebrow"]');
      const cards = document.querySelectorAll('#projekte .project');
      const firstSlug = projects[0] && projects[0].slug;
      const firstDetail = firstSlug && document.querySelector('#detail-' + CSS.escape(firstSlug) + ' .detail-copy');
      return eyebrow && eyebrow.textContent === homepage.heroEyebrow &&
        cards.length === projects.length && firstDetail && firstDetail.children.length > 0;
    }, { homepage, projects }, { timeout: 30000 });

    if (errors.length) throw new Error('Browser errors during content rendering: ' + errors.join('; '));

    await page.evaluate(() => {
      document.querySelectorAll('script[src="assets/js/cms-content.js"]').forEach(script => script.remove());
      document.querySelectorAll('[data-cms-home]').forEach(element => element.removeAttribute('data-cms-home'));
    });

    await fs.rm(output, { recursive: true, force: true });
    await copySiteFiles(root, output);
    await fs.writeFile(path.join(output, 'index.html'), await page.content(), 'utf8');

    const generated = await fs.readFile(path.join(output, 'index.html'), 'utf8');
    if (generated.includes('assets/js/cms-content.js') || generated.includes('data-cms-home')) {
      throw new Error('CMS runtime markers remain in generated HTML.');
    }
    console.log(`Built static site: ${projects.length} projects, ${Object.keys(homepage).length} homepage fields.`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
