const {ClientDH, ServerDH} = require('./27-01m.js');

const serverDH = new ServerDH(1024, 3);
const serverContext = serverDH.getContext();
console.log('serverContext =', serverContext);

const clientDH = new ClientDH(serverContext);
const clientSecret = clientDH.getSecret(serverContext);
const clientContext = clientDH.getContext();
console.log('clientContext =', clientContext);

const serverSecret = serverDH.getSecret(clientContext);

console.log('serverSecret = ', serverSecret);
console.log('clientSecret = ', clientSecret);