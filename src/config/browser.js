const puppeteer = require('puppeteer');

async function WebDriver(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  await page.setViewport({
    width: 1200,
    height: 800,
  });

  return { browser, page };
}

module.exports = { WebDriver };
