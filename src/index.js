const puppeteer = require('puppeteer');
const Mensaje = require('./mensaje.model');
const Tweet = require('./tweet.model');

require('dotenv').config();
require('./database');

const obtenerMensajePrincipal = (mensajes, elminar) => {
  let mensaje_procesado = mensajes[0].split('\n');
  if (mensaje_procesado.length >= 4) {
    for (let i = 4; i < mensaje_procesado.length; i++) {
      if (
        mensaje_procesado[i] == elminar[0] ||
        mensaje_procesado[i] == elminar[2] ||
        mensaje_procesado[i][0] == elminar[1]
      ) {
        continue;
      }

      mensaje_procesado = mensaje_procesado[i];
      break;
    }
  } else {
    mensaje_procesado = '';
  }

  return mensaje_procesado;
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(process.env.URL, {
    waitUntil: 'networkidle0',
  });

  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await page.waitForSelector('[data-testid=tweet]');
  await page.waitForTimeout(100);

  let scrollDistance = 0;
  let numIter = 0;
  let links = [];

  while (numIter < 20) {
    const datainfo = await page.$x(
      `//article/div/div/div/div[2]/div[2]/div[1]/div/div/div[1]/a`
    );

    for (let i = 0; i < datainfo.length; i++) {
      const result = await page.evaluate(e => e.href, datainfo[i]);
      links.push(result);
    }
    scrollDistance += await autoScroll(page, scrollDistance);
    await page.waitForTimeout(500);

    numIter++;
  }

  let result = links.filter((item, index) => {
    return links.indexOf(item) === index;
  });
  for (let ele of result) {
    console.log(ele);
    await page.goto(ele, {
      waitUntil: 'networkidle0',
    });

    await page.waitForSelector('[data-testid=tweet]');
    await page.waitForTimeout(100);

    let numIter2 = 0;
    let scrollDistance2 = 0;
    let mensajes = [];

    while (numIter2 < 10) {
      const datainfo2 = await page.$x(
        `//div/div/article/div/div/div/div[2]/div[2]`
      );

      if (numIter2 >= 3 && datainfo2.length == 0) break;

      for (let i = 0; i < datainfo2.length; i++) {
        const result = await page.evaluate(e => e.innerText, datainfo2[i]);
        mensajes.push(result);
      }
      scrollDistance2 += await autoScroll(page, scrollDistance2);
      await page.waitForTimeout(50);
      numIter2++;
    }

    mensajes = mensajes.filter((item, index) => {
      return mensajes.indexOf(item) === index;
    });

    const elminar = ['En respuesta a ', '@', ' y '];

    let mensaje_original = obtenerMensajePrincipal(mensajes, elminar);
    mensajes.shift();
    if (mensajes.length == 0) continue;

    mensajes_procesados = [];
    for (let m of mensajes) {
      const me = m.split('\n');
      let nombre = me[0];
      let user = me[1];
      let mensaje = '';
      for (let i = 4; i < me.length; i++) {
        if (
          me[i] == elminar[0] ||
          me[i] == elminar[2] ||
          me[i][0] == elminar[1]
        ) {
          continue;
        }

        mensaje = me[i];
        break;
      }
      mensajes_procesados.push({ username: nombre, user, mensaje });
      // const nuevoMensaje = new Mensaje({
      //   mensaje,
      //   url: ele,
      //   user,
      //   username: nombre,
      // });
      // await nuevoMensaje.save();
    }
    const nuevoMensaje = new Tweet({
      url: ele,
      mensaje: mensaje_original,
      comentarios: mensajes_procesados,
    });
    await nuevoMensaje.save();
  }
  await browser.close();
})();

async function autoScroll(page, scrollDistance) {
  const a = await page.evaluate(scrollDistance => {
    const distance = 1000;
    window.scrollBy(scrollDistance, distance);

    scrollDistance += distance;

    return distance;
  }, scrollDistance);
  return a;
}
