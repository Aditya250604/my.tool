const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const htmlPath = path.resolve(__dirname, 'tool.html');
  const url = 'file://' + htmlPath;
  const outDir = path.resolve(__dirname, '..', 'artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForSelector('#summary');

  const summary = await page.$eval('#summary', el => el.innerText);
  const data = await page.$eval('#data', el => el.innerText);

  fs.writeFileSync(path.join(outDir, 'output.txt'), `Summary:\n${summary}\n\nData:\n${data}`);
  await page.screenshot({ path: path.join(outDir, 'screenshot.png'), fullPage: true });

  await browser.close();
})();
