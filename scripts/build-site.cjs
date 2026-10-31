const fs = require('node:fs');
const fsp = require('node:fs/promises');
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
  await fsp.mkdir(destination, { recursive: true });
  for (const entry of await fsp.readdir(source, { withFileTypes: true })) {
    if (['.git', '.github', 'node_modules', 'dist'].includes(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copySiteFiles(from, to);
    } else if (entry.isFile()) {
      await fsp.copyFile(from, to);
    }
  }
}

async function main() {
  const homepage = JSON.parse(await fsp.readFile(path.join(root, 'content/homepage.json'), 'utf8'));
  const projects = JSON.parse(await fsp.readFile(path.join(root, 'content/projects.json'), 'utf8'));
  if (!Array.isArray(projects) || !projects.length) throw new Error('Project data is empty or invalid.');

  const server = http.createServer(async (req, res) => {
    let pathname = '/';
    let requested = root;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      requested = path.resolve(root, pathname.startsWith('/') ? pathname.slice(1) : pathname);
      if (!requested.startsWith(root + path.sep) && requested !== root) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      const stat = await fsp.stat(requested);
      if (!stat.isFile()) {
        res.writeHead(404).end('Not found');
        return;
      }

      const stream = fs.createReadStream(requested);
      stream.on('error', () => {
        if (res.headersSent) {
          res.destroy();
        } else {
          res.writeHead(404).end('Not found');
        }
      });

      res.writeHead(200, { 'Content-Type': mime[path.extname(requested).toLowerCase()] || 'application/octet-stream' });
      stream.pipe(res);
    } catch (error) {
      console.error(`Static server error for ${pathname} (${requested}): ${error.message}`);
      if (res.headersSent) {
        res.destroy();
      } else if (!res.writableEnded) {
        res.writeHead(404).end('Not found');
      }
    }
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const errors = [];
    const failedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('requestfailed', request => failedRequests.push(request.url() + ': ' + (request.failure()?.errorText || 'request failed')));
    page.on('response', response => {
      if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });
    const indexResponse = await page.goto(`http://127.0.0.1:${address.port}/index.html`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    if (!indexResponse || !indexResponse.ok()) {
      const body = await page.locator('body').innerText().catch(() => '');
      throw new Error(`Local index.html request failed: HTTP ${indexResponse?.status() ?? 'no response'}; title=${await page.title()}; body=${body.slice(0, 500)}; root=${root}`);
    }

    try {
      await page.waitForFunction(expected => {
        const eyebrow = document.querySelector('[data-cms-home="heroEyebrow"]');
        return eyebrow && eyebrow.textContent.trim() === expected;
      }, homepage.heroEyebrow, { timeout: 30000 });
    } catch (error) {
      const state = await page.evaluate(({ projects }) => {
        const eyebrow = document.querySelector('[data-cms-home="heroEyebrow"]');
        const cards = document.querySelectorAll('#projekte .project');
        const details = projects.map(project => {
          const article = document.querySelector('#detail-' + CSS.escape(project.slug));
          return { slug: project.slug, exists: !!article, copyChildren: article?.querySelector('.detail-copy')?.children.length ?? null };
        });
        return {
          heroText: eyebrow?.textContent ?? null,
          cardCount: cards.length,
          detailCount: document.querySelectorAll('.project-detail[id^="detail-"]').length,
          details
        };
      }, { projects });
      throw new Error('CMS rendering did not complete. Diagnostic state: ' + JSON.stringify({ ...state, browserErrors: errors, failedRequests }, null, 2));
    }

    const state = await page.evaluate(({ projects }) => ({
      cardCount: document.querySelectorAll('#projekte .project').length,
      details: projects.map(project => {
        const article = document.querySelector('#detail-' + CSS.escape(project.slug));
        return { slug: project.slug, exists: !!article, copyChildren: article?.querySelector('.detail-copy')?.children.length ?? null };
      })
    }), { projects });
    if (state.cardCount !== projects.length) throw new Error(`CMS card count mismatch: expected ${projects.length}, found ${state.cardCount}.`);
    const missingDetails = state.details.filter(detail => !detail.exists || !detail.copyChildren);
    if (missingDetails.length) throw new Error('CMS project details missing or empty: ' + JSON.stringify(missingDetails));
    if (errors.length) throw new Error('Browser errors during content rendering: ' + errors.join('; '));

    await page.evaluate(() => {
      document.querySelectorAll('script[src="assets/js/cms-content.js"]').forEach(script => script.remove());
      document.querySelectorAll('[data-cms-home]').forEach(element => element.removeAttribute('data-cms-home'));
    });

    await fsp.rm(output, { recursive: true, force: true });
    await copySiteFiles(root, output);
    await fsp.writeFile(path.join(output, 'index.html'), await page.content(), 'utf8');

    const generated = await fsp.readFile(path.join(output, 'index.html'), 'utf8');
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
