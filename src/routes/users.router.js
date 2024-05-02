import userSchema from "../schemas/user.schema.js";
import bcrypt from "bcrypt";
import {getUsersArray, rewriteDatabaseFile} from "../database/databaseService.js";
import express from "express";
import passport from "passport";
import {BasicStrategy} from "passport-http";
import jwt from 'jsonwebtoken'

const router = express.Router();

passport.use(new BasicStrategy(
    function (userId, password, done) {
        try {
            const users = getUsersArray();
            const user = users.find((user) => {return user.username === userId});
            if(user && bcrypt.compareSync(password, user.password)) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        }
        catch (e) {
            done(e);
        }
    }
));

router.post('/users', (req, res, next) => {
    const {error, value} = userSchema.validate(req.body);

    const newUser = {
        name: value.name,
        username: value.username,
        password: bcrypt.hashSync(value.password, 10),
        roles: value.roles
    }

    if(error) {
        res.status(400).send(JSON.stringify(error));
        return;
    }

    try {
        const userData = getUsersArray();

        userData.push(newUser);

        rewriteDatabaseFile('./src/database/users.json', userData);
    }
    catch (e) {
        res.status(500).send('Server error occured!');
    }

    res.setHeader('content-type', 'application/json');
    res.status(201).send(JSON.stringify(newUser));
});

router.post('/authenticate', passport.authenticate('basic', {session: false}), (req, res, next) => {
    const token = jwt.sign({
        roles: req.user.roles
    },
    'my-very-special-secret-1234',
    {
        subject: req.user.username,
        expiresIn: '1d'
    })

    res.status(200).send({token});
})

export {router};