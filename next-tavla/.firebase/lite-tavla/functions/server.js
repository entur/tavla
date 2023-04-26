const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrlitetavla = onRequest({"region":"europe-west1"}, (req, res) => server.then(it => it.handle(req, res)));
  