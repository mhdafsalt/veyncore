const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9345;

async function run() {
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,800',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
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
            window.__shifts.push({
              value: entry.value,
              startTime: entry.startTime,
              sources: entry.sources ? entry.sources.map(s => ({
                nodeName: s.node ? s.node.nodeName : null,
                className: s.node ? s.node.className : null,
                currentRect: s.currentRect,
                previousRect: s.previousRect
              })) : []
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    `
  });

  await send('Page.navigate', { url: 'http://localhost:3001/collections/all-drops' });

  // Check state at 50ms, 200ms, 500ms, 1500ms
  for (const ms of [50, 150, 300, 600, 1200]) {
    await new Promise(r => setTimeout(r, ms));
    const r = await send('Runtime.evaluate', {
      expression: `(() => {
        const f = document.querySelector('footer');
        const g = document.querySelector('.all-drops__grid');
        const cards = document.querySelectorAll('.all-drops-card');
        return JSON.stringify({
          time: performance.now(),
          footerTop: f ? f.getBoundingClientRect().top : null,
          gridTop: g ? g.getBoundingClientRect().top : null,
          gridHeight: g ? g.getBoundingClientRect().height : null,
          cardCount: cards.length,
          firstCardMediaHeight: cards[0]?.querySelector('.all-drops-card__media')?.getBoundingClientRect().height
        });
      })()`,
      returnByValue: true
    });
    console.log(`At ~${ms}ms:`, r.result?.value);
  }

  const shiftRes = await send('Runtime.evaluate', {
    expression: 'JSON.stringify(window.__shifts)',
    returnByValue: true
  });
  console.log('Shifts:', shiftRes.result?.value);

  chrome.kill();
}

run();
