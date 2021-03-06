const test = require('blue-tape');
const debug = require('debug')('drachtio:conf-tester');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

function connect(connectable) {
  return new Promise((resolve, reject) => {
    connectable.on('connect', () => {
      return resolve();
    });
  });
}

test('conf test', (t) => {
  const {srf} = require('..');
  t.timeoutAfter(180000);

  Promise.all([connect(srf)])
    .then(() => {
      t.pass('connected to dsachtio server, starting call tests');
      return new Promise((resolve, reject) => srf.on('test.complete',
        (countSuccess, countFail) => {
          if (countFail === 0) resolve(countSuccess);
          reject(new Error(`${countFail} calls failed`));
        }));
    })
    .then((countSuccess) => {
      t.pass(`test completed successfully with all ${countSuccess} calls completing`);
      srf.disconnect();
      t.end();
      return;
    })
    .catch((err) => {
      t.error(err);
      console.log(`error: ${err}: ${err.stack}`);
      srf.disconnect();
      mediaserver.disconnect();
      t.end();
    });
});
