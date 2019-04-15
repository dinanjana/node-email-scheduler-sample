/**
 * Created by dinanjanag on 4/14/19.
 */
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { DB_URL, DATABASE, QUEUE_COL, SENT_COL, FAILED_COL, EMAIL_STATUS } = require('../Constants');

const db = {};
const init = () => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
      throw error;
    }
    db.client = client.db(DATABASE);
    db.collection = {};
    db.collection[QUEUE_COL] = db.client.collection(QUEUE_COL);
    db.collection[SENT_COL] = db.client.collection(SENT_COL);
    db.collection[FAILED_COL] = db.client.collection(FAILED_COL);
    db.collection[EMAIL_STATUS] = db.client.collection(EMAIL_STATUS);

    console.log("Connected to `" + DATABASE + "`!");
  });
};

const insertEmail = (id, email, col, retries = 0) => {
  db.collection[col].insert({_id: id, email: email }, (err) => {
    if (err) {
      if (retries < 5) {
        return insertEmail(id, email, col, ++retries);
      }
      console.error('Error occurred while saving data', err);
    }
    console.log(`Email [${id}] inserted to [${col}] successfully`);
    insertStatus(id, col);
  });
};

const insertStatus = (id, status, retries = 0) => {
  db.collection[EMAIL_STATUS].insert({ _id: id, status}, (err, res) => {
    if (err) {
      if (retries < 5) {
        return insertStatus(email, col, ++retries);
      }
      console.error('Error occurred while saving data', err);
    }
    console.log(`Status of [${id}] inserted to [${EMAIL_STATUS}] successfully`);
  });
};

const getEmail = () => {};


module.exports = {
  init,
  insertEmail,
};