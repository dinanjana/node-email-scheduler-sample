/**
 * Created by dinanjanag on 4/13/19.
 */
const _ = require('lodash');
const util = require('util');
const express = require('express');
const BodyParser = require("body-parser");
const { run } = require('./service/schedulerService');
const { init } = require('./repository/db');
const { handlers } = require('./api/index');
const { DELAY, METHODS } = require('./Constants');

const app = express();
const port = 2010;

const setIntervalPromise = util.promisify(setInterval);

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

setIntervalPromise(run, DELAY);

app.listen(port, () => {
  init();
  console.log(`Example app listening on port ${port}!`)
});
