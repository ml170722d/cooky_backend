const { MongoClient, Db, ObjectId, } = require('mongodb');
const { URI, DB } = require("./uri");

function _connect() {
    return new Promise((res, rej) => {
        res(MongoClient.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true }));
    });
}

function _db(name = undefined) {
    return new Promise((res, rej) => {
        _connect().then(client => {
            if (name === undefined) throw TypeError('Name of database not provided', 'dbOper.js');
            if (!(client instanceof MongoClient)) throw new TypeError('Not instanceof MongoClient', 'dbOper.js');

            res(client.db(name));
        }).catch(err => console.error(err));
    })
}

function register(username, password) {
    return new Promise((res, rej) => {
        _db(DB).then(db => {
            if (db instanceof Db) {
                const coll = db.collection('users');

                coll.find({
                    username: username
                }).toArray().then(list => {
                    if (list.length === 0) {
                        coll.insertOne({
                            username: username,
                            password: password
                        });
                        res(true);
                    } else {
                        res(false);
                    }
                });
            }
        }).catch(err => console.error(err));
    });
}

function deleteOne(id) {
    return new Promise((res, rej) => {
        _db(DB).then(db => {
            if (db instanceof Db) {
                const coll = db.collection('users');

                coll.findOneAndDelete({ _id: ObjectId(id) }).then(doc => {
                    // console.log(doc);
                    if (doc.value != null)
                        res(200);
                    else
                        res(403);
                }).catch(err => {
                    console.error(err);
                    res(500);
                });
            }
        }).catch(err => console.error(err));
    });
}

function unregister(username, password) {
    return new Promise((res, rej) => {
        _db(DB).then(db => {
            if (db instanceof Db) {
                const coll = db.collection('users');

                coll.find({ username: username }).toArray().then(list => {
                    if (list.length === 1) {
                        if (list[0].password === password) {
                            res({ id: list[0]._id });
                        } else {
                            res({});
                        }
                    } else if (list.length > 1) {
                        throw Error('Multiple users with same username');
                    } else {
                        res({});
                    }
                });
            }
        }).catch(err => console.error(err));
    });
}

module.exports = {
    register,
    unregister,
    deleteOne,
}