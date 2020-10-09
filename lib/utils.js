const config = require('config');
const obj = module.exports = {} ;

let idx = 0;
let servers;
obj.getAvailableProxy = () => {
  servers = servers || config.get('callflow.proxy');
  if (idx == servers.length) idx = 0;
  return servers[idx++];
};
