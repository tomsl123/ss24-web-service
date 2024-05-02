import {describe, expect, jest, test} from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import express from "express";

const app = express();

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
        rewriteDatabaseFile: jest.fn().mockImplementation((filepath, data) => {
            fs.writeFileSync('./src/tests/database/avatars.json', JSON.stringify(data), {flag: 'w'});
        }),
        getUsersArray: jest.fn().mockReturnValue(mockUserData())
    };
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