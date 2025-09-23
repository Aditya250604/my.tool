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

  // Tunggu body siap
  await page.waitForSelector('body');

  // Ambil isi status kalau ada
  let statusText = '';
  try {
    statusText = await page.$eval('#status', el => el.innerText);
  } catch (e) {
    statusText = 'Tidak ada elemen #status';
  }

  // Ambil seluruh isi body sebagai fallback
  const fullBody = await page.$eval('body', el => el.innerText);

  fs.writeFileSync(
    path.join(outDir, 'output.txt'),
    `Status:\n${statusText}\n\nIsi Body:\n${fullBody}`
  );

  await page.screenshot({
    path: path.join(outDir, 'screenshot.png'),
    fullPage: true
  });

  await browser.close();
})();
