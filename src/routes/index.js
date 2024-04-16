const express = require('express');
const fs = require("node:fs");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index');
});

router.post('/create-avatar', (req, res, next) => {
    console.log(req.body);

    let avatarData = [];

    try {
        if(fs.existsSync('./src/database/avatars.json')) {
            avatarData = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString());
        }

        avatarData.push({
            id: avatarData.length,
            characterName: req.body.name,
            childAge: parseInt(req.body.age),
            skinColor: req.body.skinColor,
            headShape: req.body.headShape,
            upperClothing: req.body.upperClothing,
            lowerClothing: req.body.lowerClothing,
            createdAt: new Date().toISOString()
        });

        fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatarData), {flag: 'w'});
    }
    catch (e) {
        res.status(500).send('Server error occured!');
    }



    res.redirect('avatars');
});

router.get('/avatars', (req, res, next) => {
    const avatars = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString());
    res.render('avatars', {avatars: avatars});
});

router.get('/avatar/:id', (req, res, next) => {
    const avatar = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString())[req.params.id];
    res.render('avatarDetail', {avatar: avatar});
});

module.exports = router;