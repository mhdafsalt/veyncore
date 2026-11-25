const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let nextPort = 9400;

async function testUrl(url, isMobile = false) {
  const port = nextPort++;
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    isMobile ? '--window-size=390,844' : '--window-size=1280,800',
    'about:blank'
  ]);

  // Poll until debugging port is ready
  let targets = null;
  for (let attempt = 0; attempt < 15; attempt++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const versionRes = await fetch(`http://127.0.0.1:${port}/json`);
      if (versionRes.ok) {
        targets = await versionRes.json();
        if (targets && targets.length > 0) break;
      }
    } catch (e) {}
  }

  const pageTarget = targets?.find(t => t.type === 'page');
  if (!pageTarget) {
    chrome.kill();
    return { url, isMobile, total: -1, count: 0, shifts: [] };
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  if (isMobile) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
  }

  // Inject observer on new document BEFORE navigating
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

  // Navigate to actual URL
  await send('Page.navigate', { url });

  // Wait 3.5s for initial render and hydration
  await new Promise(r => setTimeout(r, 3500));

  // Scroll down step by step to test scrolling stability
  for (let y = 0; y <= 3500; y += 350) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await new Promise(r => setTimeout(r, 150));
  }

  await new Promise(r => setTimeout(r, 1000));

  const result = await send('Runtime.evaluate', {
    expression: `JSON.stringify(window.__shifts)`,
    returnByValue: true
  });

  const shifts = JSON.parse(result?.result?.value || '[]');
  let total = shifts.reduce((acc, s) => acc + s.value, 0);

  chrome.kill();
  return { url, isMobile, total, count: shifts.length, shifts };
}

async function run() {
  const tests = [
    { url: 'http://localhost:3001/', isMobile: true },
    { url: 'http://localhost:3001/', isMobile: false },
    { url: 'http://localhost:3001/collections/all-drops', isMobile: true },
    { url: 'http://localhost:3001/collections/all-drops', isMobile: false },
    { url: 'http://localhost:3001/veyn-objects', isMobile: true },
    { url: 'http://localhost:3001/veyn-objects', isMobile: false },
    { url: 'http://localhost:3001/collections/objects-drops', isMobile: true },
    { url: 'http://localhost:3001/collections/objects-drops', isMobile: false },
  ];

  console.log('\n=== REAL CDP NAVIGATION CLS AUDIT (PORT 3001) ===\n');
  for (const t of tests) {
    const res = await testUrl(t.url, t.isMobile);
    console.log(`URL: ${t.url} (Mobile: ${t.isMobile}) -> CLS: ${res.total.toFixed(4)} (${res.count} shifts)`);
    if (res.total > 0.05) {
      console.log('Shifts detail:', JSON.stringify(res.shifts, null, 2));
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
