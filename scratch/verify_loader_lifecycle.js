const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9560;

async function run() {
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=390,844',
    'about:blank'
  ]);

  for (let attempt = 0; attempt < 15; attempt++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const versionRes = await fetch(`http://127.0.0.1:${port}/json`);
      if (versionRes.ok) break;
    } catch (e) {}
  }

  const versionRes = await fetch(`http://127.0.0.1:${port}/json`);
  const targets = await versionRes.json();
  const pageTarget = targets.find(t => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    const h = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', h);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__shifts = [];
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__shifts.push(entry.value);
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    `
  });

  await send('Page.navigate', { url: 'http://localhost:3001/' });

  // Probe at 200ms (loader should be visible)
  await new Promise(r => setTimeout(r, 200));
  const probe1 = await send('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.querySelector('.veyn-loader');
      const logo = document.querySelector('.veyn-loader__logo');
      return JSON.stringify({
        loaderExists: !!loader,
        loaderDisplay: loader ? window.getComputedStyle(loader).display : null,
        loaderOpacity: loader ? window.getComputedStyle(loader).opacity : null,
        logoSrc: logo ? logo.getAttribute('src') : null,
        logoVisible: logo ? logo.getBoundingClientRect().width > 0 : false
      });
    })()`,
    returnByValue: true
  });
  console.log('Loader at 200ms:', probe1.result?.value);

  // Probe at 2500ms (loader should have finished, faded out, and unmounted)
  await new Promise(r => setTimeout(r, 2300));
  const probe2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.querySelector('.veyn-loader');
      const totalShift = window.__shifts.reduce((a, b) => a + b, 0);
      return JSON.stringify({
        loaderExists: !!loader,
        bodyOverflow: document.body.style.overflow,
        totalShift: totalShift
      });
    })()`,
    returnByValue: true
  });
  console.log('Loader at 2500ms:', probe2.result?.value);

  chrome.kill();
}

run();
