const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9585;

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

  await send('Page.navigate', { url: 'https://veyncorein.vercel.app/' });

  // Wait 4.5s
  await new Promise(r => setTimeout(r, 4500));
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const loader = document.querySelector('.veyn-loader');
      return JSON.stringify({
        loaderPresent: !!loader,
        bodyOverflow: document.body.style.overflow
      });
    })()`,
    returnByValue: true
  });
  console.log('Live after 4.5s:', res.result?.value);

  chrome.kill();
}

run();
