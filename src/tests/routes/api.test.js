import {jest, test, expect, beforeEach, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope
import request from 'supertest';
import app from "../../main.js";
import bcrypt from "bcrypt";

const TEST_AVATAR_DATA = [
    {
        id: 1713260956262,
        characterName: "User",
        childAge: 5,
        skinColor: "#ffffff",
        headShape: "Round",
        hairStyle: "Pixie Cut",
        upperClothing: "T-Shirt",
        lowerClothing: "Jeans",
        createdAt: "2024-04-16T09:49:16.262Z"
    },
    {
        id: 1713260959175,
        characterName: "South",
        childAge: 6,
        skinColor: "#ffffff",
        headShape: "Round",
        hairStyle: "Pixie Cut",
        upperClothing: "T-Shirt",
        lowerClothing: "Jeans",
        createdAt: "2024-04-16T09:49:19.175Z"
    },
    {
        id: 1713260962362,
        characterName: "API",
        childAge: 7,
        skinColor: "#ffffff",
        headShape: "Round",
        hairStyle: "Pixie Cut",
        upperClothing: "T-Shirt",
        lowerClothing: "Jeans",
        createdAt: "2024-04-16T09:49:22.362Z"
    }
];

const TEST_USER_CREDENTIALS = {
    username: 'SomeUsername',
    password: '123'
}

let mockUserData = [
    {
        name: 'SomeName',
        username: TEST_USER_CREDENTIALS.username,
        password: bcrypt.hashSync(TEST_USER_CREDENTIALS.password, 10),
        roles: ['parent']
    }
];

jest.mock('../../database/databaseService.js', () => {
    const fs = jest.requireActual('fs');

    return {
        __esModule: true,
        getAvatarsArray: jest.fn().mockReturnValue(TEST_AVATAR_DATA),
        rewriteDatabaseFile: jest.fn().mockImplementation((filepath, data) => {
            fs.writeFileSync('./src/tests/database/avatars.json', JSON.stringify(data), {flag: 'w'});
        }),
        getUsersArray: jest.fn().mockReturnValue([{
            name: 'SomeName',
            username: 'SomeUsername',
            password: '$2b$10$sWnERVP1teQKpMY.W0jU.e35/5ceNY1RJUN4vX84mdhfvcd/CyimC',
            roles: ['parent']
        }])
    };
});

describe('API Avatar Creation', () => {

    const TEST_AVATAR_REQUEST_JSON = {
        "characterName": "Mark",
        "childAge": 12,
        "skinColor": "#0000ff",
        "hairStyle": "Classic Bob",
        "headShape": "Oval",
        "upperClothing": "T-shirt",
        "lowerClothing": "Shorts"
    }

    beforeEach(() => {
        jest.resetModules();
    });

    test('response works and has correct format', async () => {

        const response = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(TEST_AVATAR_REQUEST_JSON)
            .set('Accept', 'application/json')
            .expect(201);

        expect(response.body).toMatchObject(TEST_AVATAR_REQUEST_JSON);
        expect(response.body.id).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
    });

    test('Request must contain characterName', async () => {

        const testData = {
            "childAge": 12,
            "skinColor": "#0000ff",
            "hairStyle": "Classic Bob",
            "headShape": "Oval",
            "upperClothing": "T-shirt",
            "lowerClothing": "Shorts"
        }

        const response = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('Request must contain childAge', async () => {

        const testData = {
            "characterName": "Mark",
            "skinColor": "#0000ff",
            "hairStyle": "Classic Bob",
            "headShape": "Oval",
            "upperClothing": "T-shirt",
            "lowerClothing": "Shorts"
        }

        const response = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('Request must contain skinColor', async () => {

        const testData = {
            "characterName": "Mark",
            "childAge": 12,
            "hairStyle": "Classic Bob",
            "headShape": "Oval",
            "upperClothing": "T-shirt",
            "lowerClothing": "Shorts"
        }

        const response = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('Request must not contain lowerClothing when upperClothing value is Dress', async () => {

        const testData = {
            "characterName": "Mark",
            "childAge": 12,
            "skinColor": "#0000ff",
            "hairStyle": "Classic Bob",
            "headShape": "Oval",
            "upperClothing": "Dress"
        }

        const response1 = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(201);

        testData.lowerClothing = 'Shorts';

        const response2 = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('Response contains default values when undefined in Request',  async () => {
        const testData = {
            "characterName": "Mark",
            "childAge": 12,
            "skinColor": "#0000ff"
        };

        const response = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(201);

        const {headShape, hairStyle, upperClothing, lowerClothing} = response.body;
        expect(headShape).toBeDefined();
        expect(hairStyle).toBeDefined();
        expect(upperClothing).toBeDefined();
        expect(lowerClothing).toBeDefined()
    });

    test('Server validates characterName correctly',  async () => {
        const testData = {
            "characterName": "Ma",
            "childAge": 12,
            "skinColor": "#0000ff"
        }

        const response1 = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);

        testData.characterName = 'Markkkkkkkkkkkkkkkkkk';

        const response2 = await request(app)
            .post('/api/avatars')
            .auth(TEST_USER_CREDENTIALS.username, TEST_USER_CREDENTIALS.password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);
    })
});

