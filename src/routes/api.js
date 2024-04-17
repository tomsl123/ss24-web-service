import express from 'express';
import fs from 'fs';
const router = express.Router();

router.post('/avatars', (req, res, next) => {
    //console.log(req.body);

    const newAvatar = {
        id: Date.now(),
        characterName: req.body.characterName,
        childAge: parseInt(req.body.childAge),
        skinColor: req.body.skinColor,
        headShape: req.body.headShape,
        hairStyle: req.body.hairStyle,
        upperClothing: req.body.upperClothing,
        lowerClothing: req.body.lowerClothing,
        createdAt: new Date().toISOString()
    }
    try {
        const avatarData = getAvatarsArray();

        avatarData.push(newAvatar);

        fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatarData), {flag: 'w'});
    }
    catch (e) {
        res.status(500).send('Server error occured!');
    }

    res.setHeader('content-type', 'application/json');
    res.status(201).set('Location', '/api/avatar/' + newAvatar.id).send(JSON.stringify(newAvatar));
});

router.get('/avatars', (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send(JSON.stringify(getAvatarsArray()))
});

router.get('/avatars/:id', (req, res, next) => {
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

router.put('/avatars/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.sendStatus(400);
        return;
    }

    const avatarData = getAvatarsArray();
    const avatarIndex = avatarData.findIndex((avatar) => {return avatar.id === id});

    if(avatarIndex === -1) {
        res.sendStatus(404);
        return;
    }

    avatarData[avatarIndex] = {
        id: avatarData[avatarIndex].id,
        characterName: req.body.characterName,
        childAge: parseInt(req.body.childAge),
        skinColor: req.body.skinColor,
        headShape: req.body.headShape,
        hairStyle: req.body.hairStyle,
        upperClothing: req.body.upperClothing,
        lowerClothing: req.body.lowerClothing,
        createdAt: avatarData[avatarIndex].createdAt
    };

    fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatarData), {flag: 'w'});

    res.sendStatus(204);
});

router.delete('/avatars/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.sendStatus(400);
        return;
    }

    const avatarData = getAvatarsArray();
    const avatarIndex = avatarData.findIndex((avatar) => {return avatar.id === id});

    if(avatarIndex === -1) {
        res.sendStatus(404);
        return;
    }

    avatarData.splice(avatarIndex, 1);

    fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatarData), {flag: 'w'});

    res.sendStatus(204);
})

function getAvatarsArray() {
    let avatarData = [];
    if(fs.existsSync('./src/database/avatars.json')) {
        avatarData = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString());
    }
    return avatarData;
}

export default router;