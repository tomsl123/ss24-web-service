import express from 'express';
import fs from 'fs';
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/avatars', (req, res, next) => {
    const avatars = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString());
    res.render('avatars', {avatars: avatars});
});

router.get('/avatar/:id', (req, res, next) => {
    const avatar = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString())[req.params.id];
    res.render('avatarDetail', {avatar: avatar});
});
export default router;