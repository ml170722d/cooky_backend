const express = require('express');
const { register, unregister, deleteOne } = require('./modules/dbOper');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8081;

app.post('/register', (req, res) => {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')){
        res.sendStatus(400);
        return;
    }

    register(req.body.username, req.body.password).then(success => {
        if (success) {
            res.sendStatus(200);
        } else {
            res.sendStatus(406);
        }
    }).catch(e => { console.log(e) });
});

app.post('/unregister', (req, res) => {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')){
        res.sendStatus(400);
        return;
    }

    unregister(req.body.username, req.body.password).then(user => {
        if (user.id === ''){
            res.statusCode = 401;
        }
        res.json(user);
    }).catch(e => {
        console.log(e);
        res.statusCode = 503;
        res.json(e);
    });
})

app.delete('/unregister', (req, res) => {
    if (!req.body.hasOwnProperty('id')){
        res.sendStatus(400);
        return;
    }

    deleteOne(req.body.id).then(code=>{
        res.sendStatus(code);
    }).catch(e=>{
        console.error(e);
        res.sendStatus(500);
    })
})

const serverListener = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

