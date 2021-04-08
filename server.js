const e = require('express');
const express = require('express');
const dbmod = require('./modules/dbmod');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8081;
const appName = '/cooky';

app.post(`${appName}/register`, (req, res) => {
    dbmod.register(req.body).then(_ => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(401);
    });
});

app.delete(`${appName}/unregister`, (req, res) => {
    dbmod.unregister(req.body).then(_ => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(401);
    });
});

app.post(`${appName}/signin`, (req, res) => {
    dbmod.signin(req.body).then(_ => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(401);
    });
});

app.post(`${appName}/save`, (req, res) => {
    dbmod.saveRecipe(req.body).then(_ => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(401);
    });
});

app.post(`${appName}/edit`, (req, res) => {
    dbmod.editRecipe(req.body.q, req.body.data).then(_ => {
        res.sendStatus(200);
    }).catch(err=>{
        console.error(err);
        res.sendStatus(401);
    });
});

app.delete(`${appName}/delete`, (req, res) => {
    dbmod.deleteRecipe(req.body).then(_ => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(401);
    });
});

app.get(`${appName}/search`, (req, res) => {
    dbmod.search('recipe_' + req.body.lang, req.body.query).then(cursor => {
        return cursor.toArray();
    }).then(list => {
        list.forEach(e => {
            delete e._id;
        });
        res.json(list);
    }).catch(err => {
        console.error(err);
        res.sendStatus(401);
    });
});

const serverListener = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

