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
      throw err;
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
      throw err;
    }
    console.log(`Status of [${id}] inserted to [${EMAIL_STATUS}] successfully`);
  });
};

const getEmail = (id, col, retries = 0) => {
  return new Promise((resolve, reject) => {
    db.collection[col].findOne({'_id': new ObjectId(id)}, (err, res) => {
      if (err) {
        if (retries < 5) {
          return getEmail(email, ++retries);
        }
        console.error('Error occurred while saving data', err);
        reject(err);
      }
      resolve(res);
    });
  });
};

const getAllEmails = (col, retries = 0) => {
  return db.collection[col].find({}).toArray().then(emails => {
    console.log(`Fetched [${emails.length}] number of items`);
    return emails;
  }).catch(err => {
    if (retries < 5) {
      return getAllEmails(col, ++retries);
    }
    console.error('Error occurred while fetching emails');
    throw err;
  });
};

const deleteEmail = (id, col) => {
  return db.collection[col].deleteOne({'_id': new ObjectId(id)})
  .then(data => {
    const res = JSON.parse(data).n === 1;
    if (res) {
      db.collection[EMAIL_STATUS].deleteOne({'_id': new ObjectId(id)})
      .catch(err => {
        console.error(`Error occurred while deleting email ref [${id}] from [${col}]`, err);
        throw err;
      });
    }
    return res;
  })
  .catch(err => {
    console.error(`Error occurred while deleting email [${id}] from [${col}]`, err);
    throw err;
  })
};

const updateStatus = (id, status) => {
  return db.collection[EMAIL_STATUS]
  .updateOne({'_id': new ObjectId(id)}, {$set: { status, }})
  .then(data => data)
  .catch(err => {
    console.error(`Error occurred while updating email [${id}] with [${status}]`, err);
  });
};


module.exports = {
  init,
  insertEmail,
  getEmail,
  getAllEmails,
  deleteEmail,
  updateStatus,
};