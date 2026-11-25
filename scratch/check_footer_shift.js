const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9339;

async function run() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=' + port,
    '--headless=new',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3001/collections/all-drops'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://127.0.0.1:' + port + '/json');
    const targets = await res.json();
    const t = targets.find(x => x.type === 'page');
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise(r => {
      const i = id++;
      const h = e => {
        const m = JSON.parse(eventData(e));
        if (m.id === i) { ws.removeEventListener('message', h); r(m.result); }
      };
      function eventData(e) { return e.data; }
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: i, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const evalBox = async (label) => {
      const r = await send('Runtime.evaluate', {
        expression: `(() => {
          const f = document.querySelector('footer');
          const g = document.querySelector('.all-drops__grid');
          const c = document.querySelector('.all-drops-card--skeleton');
          const media = document.querySelector('.all-drops-card__media');
          const allDrops = document.querySelector('.all-drops');
          return JSON.stringify({
            footerTop: f ? f.getBoundingClientRect().top : null,
            footerHeight: f ? f.getBoundingClientRect().height : null,
            gridTop: g ? g.getBoundingClientRect().top : null,
            gridHeight: g ? g.getBoundingClientRect().height : null,
            cardHeight: c ? c.getBoundingClientRect().height : null,
            mediaHeight: media ? media.getBoundingClientRect().height : null,
            allDropsHeight: allDrops ? allDrops.getBoundingClientRect().height : null,
          });
        })()`,
        returnByValue: true
      });
      console.log(label, r.result.value);
    };

    await evalBox('Initial (before hydration)');
    await new Promise(r => setTimeout(r, 1500));
    await evalBox('Hydrated (after hydration)');
    chrome.kill();
  } catch(e) {
    console.error(e);
    chrome.kill();
  }
}

run();
