/**
 * Created by dinanjanag on 4/13/19.
 */
const _ = require('lodash');
const express = require('express');
const BodyParser = require("body-parser");
const { init } = require('./repository/db');
const { handlers } = require('./api/index');
const { METHODS } = require('./Constants');
const app = express();
const port = 2010;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const registerHandlers = () => {
  _.map(handlers, (handlers, path) => {
    _.map(handlers, ({method, handler}) => {
      switch (method) {
        case METHODS.POST: {
          app.post(path, handler);
          break;
        }
        case METHODS.GET: {
          app.get(path, handler);
          break;
        }
        case METHODS.DELETE: {
          app.delete(path, handler);
        }
      }
      console.log(`registered handle with path [${path}] method [${method}]`);
    });
  });
};

app.get('/', (req, res) => res.send('Hello World!'));

registerHandlers();

app.listen(port, () => {
  init();
  console.log(`Example app listening on port ${port}!`)
});
