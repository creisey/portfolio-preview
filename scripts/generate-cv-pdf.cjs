const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const root = process.cwd();
  const output = path.join(root, 'assets', 'documents', 'cv-josias-marti.pdf');
  await fs.mkdir(path.dirname(output), { recursive: true });

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({
      viewport: { width: 1365, height: 1000 },
      deviceScaleFactor: 1
    });

    const htmlPath = path.join(root, 'index.html');
    await page.goto('file://' + htmlPath + '#cv', {
      waitUntil: 'load',
      timeout: 90000
    });

    await page.evaluate(() => {
      document.body.classList.remove('project-open');
      window.location.hash = '#cv';
    });
    await page.emulateMedia({ media: 'print' });

    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' }
    });

    const stats = await fs.stat(output);
    if (stats.size < 10000) throw new Error('Generated CV PDF is unexpectedly small.');
    console.log(`Generated current CV PDF: ${output} (${stats.size} bytes)`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
