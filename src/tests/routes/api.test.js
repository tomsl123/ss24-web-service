import {jest, test, expect, beforeEach, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope

import request from 'supertest';
import app from "../../main.js";

describe('avatar api', () => {

    const TEST_DATA = {
        "characterName": "Mark",
        "childAge": 12,
        "skinColor": "#0000ff",
        "hairStyle": "short",
        "headShape": "oval",
        "upperClothing": "jacket",
        "lowerClothing": "shorts"
    }

    test('create avatar', async () => {
        const response = await request(app)
            .post('/api/avatars')
            .send(TEST_DATA)
            .set('Accept', 'application/json')
            .expect(201);

        expect(response.body).toMatchObject(TEST_DATA);
        expect(response.body.id).toBeGreaterThan(0);
        expect(response.body.createdAt).toBeDefined();
    });



    test('Get Avatar by ID',  async () => {

    });
});

