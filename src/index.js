const { WebDriver } = require('./config/browser');
const { getHomePage } = require('./scrapper');

require('dotenv').config();
// require('./config/database');

(async () => {
  const start = new Date();
  try {
    const { browser, page } = await WebDriver(process.env.URL);

    const response = await getHomePage(page);
    console.log(response);

    await browser.close();
  } catch (e) {
    console.log(`Error:\n ${e}`);
    process.exit(1);
  } finally {
    const end = new Date() - start;
    console.log(`Tiempo de ejecución ${end} ms`);
  }
})();
