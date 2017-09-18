const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const app = express();
const port = process.env.PORT || '8081';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,' +
    'Content-Type, Accept');
  next();
});

app.get('/api/fetch', (req, res) => {
  request('http://' + req.query.url, (error, response, html) => {
    if (!error) {
      let tags = {};
      let tagObjs = cheerio.load(html)('*');

      for (let i = 0; i < tagObjs.length; i++) {
        let tag = tagObjs[i].name[0].toUpperCase() + tagObjs[i].name.slice(1);
        tags[tag] = tags[tag] ? tags[tag] + 1 : 1;
      }

      res.send({ html, tags });
    } else {
      res.send({ error });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

app.listen(port, () => console.log('Now listening on port ' + port + '...'));
exports = module.exports = app;
