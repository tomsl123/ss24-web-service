import {jest, test, expect, beforeEach, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope

jest.mock('../../routes/api.js', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('../../routes/api.js');
    const fs = jest.requireActual('fs');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        getAvatarsArray: jest.fn().mockReturnValue(TEST_SERVER_DATA),
        rewriteDatabaseFile: jest.fn().mockImplementation((filepath, data) => {
            fs.writeFileSync('./src/tests/database/avatars.json', JSON.stringify(data), {flag: 'w'});
        })
    };
});

import request from 'supertest';
import app from "../../main.js";

const TEST_SERVER_DATA = [
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

describe('avatar api operations', () => {

    const TEST_REQUEST_JSON = {
        "characterName": "Mark",
        "childAge": 12,
        "skinColor": "#0000ff",
        "hairStyle": "short",
        "headShape": "oval",
        "upperClothing": "jacket",
        "lowerClothing": "shorts"
    }

    beforeEach(() => {
        jest.resetModules();
    });

    test('create avatar', async () => {

        const response = await request(app)
            .post('/api/avatars')
            .send(TEST_REQUEST_JSON)
            .set('Accept', 'application/json')
            .expect(201);

        expect(response.body).toMatchObject(TEST_REQUEST_JSON);
        expect(response.body.id).toBeGreaterThan(0);
        expect(response.body.createdAt).toBeDefined();
    });

    test('Get all avatars',  async () => {
        const response = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200);


    });
});

