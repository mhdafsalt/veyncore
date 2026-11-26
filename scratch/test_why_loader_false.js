const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9555;

async function run() {
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=390,844',
    'http://localhost:3001/'
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

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.args.map(a => a.value).join(' '));
    }
  };

  await new Promise(r => setTimeout(r, 500));
  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        html: document.body.innerHTML.substring(0, 300),
        hasVeynLoaderClass: !!document.querySelector('.veyn-loader'),
      };
    })()`,
    returnByValue: true
  });
  console.log('Body start:', r.result?.value);

  chrome.kill();
}

run();
