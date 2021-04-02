const express = require('express');
const { register, unregister, signin } = require('./modules/dbOper');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8081;

app.post('/register', (req, res) => {
    register(req.body)
        .then(success => res.sendStatus(success))
        .catch(fail => res.sendStatus(fail));
});

app.delete('/unregister', (req, res) => {
    unregister(req.body)
        .then(success => res.sendStatus(success))
        .catch(err => {
            if (err instanceof Error) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(err);
            }
        });
});

app.post('/signin', (req, res) => {
    signin(req.body)
        .then(success => res.sendStatus(success))
        .catch(err => {
            if (err instanceof Error) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(err);
            }
        });
})

const serverListener = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

