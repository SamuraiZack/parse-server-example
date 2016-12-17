// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = 'mongodb://SamuraiZack:T1meMuffin1856@ds129095-a0.mlab.com:29095,ds129095-a1.mlab.com:29095/aftercredits?replicaSet=rs-ds129095';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'KIaVlwePeCpkXHNucb21T52C6Nnkmk2ISarDkqEw',
masterKey: process.env.MASTER_KEY || 'fTd638q0DN5jFThXzvETErGqGKXomVQ9zeYmskJU', //Add your master key here. Keep it secret!
serverURL: process.env.SERVER_URL || 'https://after-credits-95724.herokuapp.com/parse',  // Don't forget to change to https if needed
clientKey: 'AtlRBUqOpJ4d3tAAo5Hi1utHmzv9WxafwXJaUzOU' //Add your master key here. Keep it secret!
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
