import express from 'express';
import fs from 'fs';
import {getAvatarsArray, getUsersArray, rewriteDatabaseFile} from "../database/databaseService.js";
import avatarSchema from "../schemas/avatar.schema.js";

import {v4 as uuid} from 'uuid';
import {createValidator} from 'express-joi-validation';
import passport from "passport";
import {BasicStrategy} from "passport-http"
import bcrypt from "bcrypt";
import {isChild, isParent} from "../auth/roles.js";
import userSchema from "../schemas/user.schema.js";

const router = express.Router();
const validator = createValidator()

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

router.post('/avatars',
    passport.authenticate('basic', {session: false}),
    isParent,
    (req, res, next) => {
        //console.log(req.body);

        const {error, value} = avatarSchema.validate(req.body);

        const newAvatar = {
            id: uuid(),
            ...value,
            createdAt: new Date().toISOString()
        }

        if(error) {
            res.status(400).send(JSON.stringify(error));
            return;
        }

        try {
            const avatarData = getAvatarsArray();

            avatarData.push(newAvatar);

            rewriteDatabaseFile('./src/database/avatars.json', avatarData);
        }
        catch (e) {
            res.status(500).send('Server error occured!');
        }

        res.setHeader('content-type', 'application/json');
        res.status(201).set('Location', '/api/avatar/' + newAvatar.id).send(JSON.stringify(newAvatar));
});

router.get(
    '/avatars',
    passport.authenticate('basic', {session: false}),
    isParent,
    (req, res, next) => {
        res.setHeader('content-type', 'application/json');
        res.status(200).send(JSON.stringify(getAvatarsArray()))
});

router.get('/avatars/:id',
    passport.authenticate('basic', {session: false}),
    isChild,
    (req, res, next) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)) {
            res.sendStatus(400);
            return;
        }

        const avatar = getAvatarsArray().find((avatar) => {return avatar.id === id});

        if(avatar === undefined) {
            res.sendStatus(404);
        }
        else {
            res.setHeader('content-type', 'application/json');
            res.status(200).send(JSON.stringify(avatar));
        }
});

router.put('/avatars/:id',
    passport.authenticate('basic', {session: false}),
    isParent,
    (req, res, next) => {
        const id = req.params.id

        const avatarData = getAvatarsArray();
        const avatarIndex = avatarData.findIndex((avatar) => {return avatar.id === id});

        if(avatarIndex === -1) {
            res.sendStatus(404);
            return;
        }

        const {error, value} = avatarSchema.validate(req.body);

        avatarData[avatarIndex] = {
            id: avatarData[avatarIndex].id,
            ...value,
            createdAt: avatarData[avatarIndex].createdAt
        };

        if(error) {
            res.status(400).send(JSON.stringify(error));
            return;
        }

        rewriteDatabaseFile('./src/database/avatars.json', avatarData);

        res.sendStatus(204);
});

router.delete('/avatars/:id',
    passport.authenticate('basic', {session: false}),
    isParent,
    (req, res, next) => {
        const id = req.params.id

        const avatarData = getAvatarsArray();
        const avatarIndex = avatarData.findIndex((avatar) => {return avatar.id === id});

        if(avatarIndex === -1) {
            res.sendStatus(404);
            return;
        }

        avatarData.splice(avatarIndex, 1);

        rewriteDatabaseFile('./src/database/avatars.json', avatarData);

        res.sendStatus(204);
})

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

export {router};