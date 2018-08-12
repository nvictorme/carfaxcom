const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const mongoUrl = 'mongodb://localhost:27017';

const mongoConnect = dbName => {
    return new Promise((fulfill, reject) => {
        MongoClient.connect(mongoUrl, {
            useNewUrlParser: true
        }, (err, client) => {
            if (!assert.equal(null, err)) {
                console.log(`Connected to DB: ${dbName}`);
                const db = client.db(dbName);
                fulfill(db);
            } else {
                reject(err);
            }
        })
    })
};

const insertDocuments = (db, coll, docs) => {
    return new Promise((fulfill, reject) => {
        // Get the collection
        const collection = db.collection(coll);
        // Insert some documents
        collection.insert(docs, {
            ordered: false
        }, function (err, result) {
            if (err) {
                reject(err);
            } else {
                fulfill(result);
            }
        });
    })
}

module.exports = {
    mongoConnect,
    insertDocuments
};