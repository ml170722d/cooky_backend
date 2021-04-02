const { MongoClient } = require('mongodb');
const { URL } = require("./url");

function _connect() {
    return new Promise((res, rej) => {
        MongoClient.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true })
            .then(client => {
                res(client);
            });
    });
}

function register({ username, password, email }) {
    return new Promise((res, rej) => {
        _connect().then(conn => {
            if (conn instanceof MongoClient) {
                let coll = conn.db().collection('users');
                coll.countDocuments({
                    user: username
                }).then(n => {
                    if (n > 0) return rej(406);

                    coll.insertOne({
                        user: username,
                        pwd: password,
                        email: email
                    }).then(r => {
                        res(201);
                    });

                }).catch(console.error);
            }
        }).catch(console.error);
    });
}

function unregister({ username, password }) {
    return new Promise((res, rej) => {
        _connect().then(conn => {
            if (conn instanceof MongoClient) {
                let coll = conn.db().collection('users');
                coll.countDocuments({
                    user: username,
                    pwd: password
                }).then(n => {
                    if (n === 0) return rej(401);
                    if (n > 1) throw new Error('Two or more users with same username');

                    coll.deleteOne({
                        user: username
                    }).then(r => {
                        res(200);
                    })

                }).catch(console.error);
            }
        }).catch(console.error);
    });
}

function signin({ username, password }) {
    return new Promise((res, rej) => {
        _connect().then(conn => {
            if (conn instanceof MongoClient) {
                let coll = conn.db().collection('users');
                coll.countDocuments({
                    user: username,
                    pwd: password
                }).then(n => {
                    if (n === 0) return rej(401);
                    if (n > 1) throw new Error('Two or more users with same username');

                    res(202);
                }).catch(console.error);
            }
        }).catch(console.error);
    });
}


module.exports = {
    register,
    unregister,
    signin,
}