const express = require('express'),
      path = require('path'),
      webpack = require('webpack'),
      config = require('./webpack.config'),
      port = 8080;

let compiler = webpack(config),
    app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
}));

app.use(require('webpack-hot-middleware')(compiler))

app.get('/', (req, res) => {
  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1,width=device-width">
        <title>Application Scaffold</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="main.js"></script>
      </body>
    </html>`
  )
})

app.listen('8080', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info(`==> 🌎  Listening on port ${port}. Open up http://0.0.0.0:${port}/ in your browser.`);
});
