import fs from "fs";

export function getAvatarsArray() {
    let avatarData = [];
    if(fs.existsSync('./src/database/avatars.json')) {
        avatarData = JSON.parse(fs.readFileSync('./src/database/avatars.json').toString());
    }
    return avatarData;
}

export function rewriteDatabaseFile(databaseFilePath, data) {
    fs.writeFileSync(databaseFilePath, JSON.stringify(data), {flag: 'w'});
}

export function getUsersArray() {
    let users = [];
    if(fs.existsSync('./src/database/users.json')) {
        users = JSON.parse(fs.readFileSync('./src/database/users.json').toString());
    }
    return users;
}