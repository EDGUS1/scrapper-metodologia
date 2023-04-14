async function getHomePage(page) {
  await page.waitForSelector('[data-testid=tweet]');
  const element = await page.waitForXPath(
    '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/section/div/div/div[2]/div/div/div/h2/div[2]/span'
  );
  const result = await element.evaluate(el => el.textContent);

  await page.screenshot({
    path: 'src/static/foto.png',
  });

  return result;
}

module.exports = { getHomePage };
