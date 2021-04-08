const { MongoClient } = require('mongodb');
const { URL } = require("./env");

function _connect() {
    return MongoClient.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true }).then(client => {
        return client;
    });
}

function _collection(name) {
    return _connect().then(conn => {
        return conn.db().collection(name);
    });
}

function _count(name, query) {
    return _collection(name).then(coll => {
        return coll.countDocuments(query);
    });
}

function _insert(name, query) {
    return _collection(name).then(coll => {
        return coll.insertOne(query);
    });
}

function _delete(name, query) {
    return _collection(name).then(coll => {
        return coll.deleteOne(query);
    });
}

function _update(name, query, data) {
    return _collection(name).then(coll => {
        return coll.findOneAndUpdate(query, data);
    });
}

function _find(name, query) {
    return _collection(name).then(coll => {
        return coll.find(query);
    });
}

function register({ username, password, email }) {
    let name = 'users';

    return _count(name, { user: username }).then(n => {
        if (n > 0) throw new Error('Username already taken');

        return _insert(name, {
            user: username,
            pwd: password,
            email: email
        });
    });
}

function unregister({ username, password }) {
    let name = 'users';
    let query = {
        user: username,
        pwd: password
    };

    return _count(name, query).then(n => {
        if (n != 1) throw new Error('Not authorized');

        return _delete(name, query);
    });
}

function signin({ username, password }) {
    let name = 'users';
    let query = {
        user: username,
        pwd: password
    };

    return _count(name, query).then(n => {
        if (n != 1) throw new Error('Not authorized');

        return n;
    });
}

function saveRecipe(query = { names, recipe, ingredients, tags, lang }) {
    let collName = 'recipe_' + query.lang;

    return _count(collName, { names: { $in: query.names } }).then(n => {
        if (n > 0) throw new Error('Recipe exists');

        return _insert(collName, query);
    });
}

function deleteRecipe(query = { names, lang }) {
    let collName = 'recipe_' + query.lang;
    let q = {
        names: { $in: query.names }
    };

    return _delete(collName, q);
}

function editRecipe(query = { names, lang },
    data = { names, recipe, ingredients, tags, lang }) {

    let collName = 'recipe_' + query.lang;
    let q = {
        names: { $in: query.names }
    };

    return _update(collName, q, data);
}

function search(name, query) {
    return _find(name, query);
}

module.exports = {
    register,
    unregister,
    signin,
    saveRecipe,
    deleteRecipe,
    editRecipe,
    search,
}