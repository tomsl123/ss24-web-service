import {jest, test, expect, beforeEach, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope
import request from 'supertest';
import app from "../../main.js";
import bcrypt from "bcrypt";

//TODO:  Otestovat vytvoreni uzivatle se vsim vsudy; Optional middleware validace + otestovat zbyle avatar metdoy


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

// Data for credentials and user data cannot be const due to uninitialized error when mocking databaseService
function mockUserCredentials() {
    return {
        username: 'SomeUsername',
        password: '123' // Beware when changing, change also mockUserData, bcrypt cannot be used here!
    }
}

function mockUserData() {
    return [
        {
            name: 'SomeName',
            username: mockUserCredentials().username,
            password: '$2b$10$sWnERVP1teQKpMY.W0jU.e35/5ceNY1RJUN4vX84mdhfvcd/CyimC', // 123
            roles: ['parent']
        }
    ];
}

jest.mock('../../database/databaseService.js', () => {
    const fs = jest.requireActual('fs');
    const bcrypt = jest.requireActual('bcrypt')

    return {
        __esModule: true,
        getAvatarsArray: jest.fn().mockReturnValue(TEST_AVATAR_DATA),
        rewriteDatabaseFile: jest.fn().mockImplementation((filepath, data) => {
            fs.writeFileSync('./src/tests/database/avatars.json', JSON.stringify(data), {flag: 'w'});
        }),
        getUsersArray: jest.fn().mockReturnValue(mockUserData())
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
            .auth(mockUserCredentials().username, mockUserCredentials().password)
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

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
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

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
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

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
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

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(201);

        testData.lowerClothing = 'Shorts';

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
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
            .auth(mockUserCredentials().username, mockUserCredentials().password)
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

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);

        testData.characterName = 'Markkkkkkkkkkkkkkkkkk';

        await request(app)
            .post('/api/avatars')
            .auth(mockUserCredentials().username, mockUserCredentials().password)
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);
    })
});

describe('API User Creation', () => {

    const TEST_USER_REQUEST_JSON = {
        name: mockUserData()[0].name,
        roles: mockUserData()[0].roles,
        ...mockUserCredentials()
    }

    test('Response works and has correct format', async () => {
        const response = await request(app)
            .post('/api/users')
            .send(TEST_USER_REQUEST_JSON)
            .set('Accept', 'application/json')
            .expect(201);

        expect(response.body.name).toBe(TEST_USER_REQUEST_JSON.name)
        expect(response.body.username).toBe(TEST_USER_REQUEST_JSON.username)
        expect(response.body.roles).toStrictEqual(TEST_USER_REQUEST_JSON.roles)
        expect(bcrypt.compareSync(TEST_USER_REQUEST_JSON.password, response.body.password)).toBeTruthy();
    });

    test('Request must contain name and name must be formatted properly', () => {

    })
});

