import request from 'supertest';
import { app } from '../../index';
import { AppDataSource } from '../../data-source';
import { createTestUser, generateToken } from '../helpers/testFactory';

describe('Journal API E2E Tests', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        const user = await createTestUser();
        userId = user.id;
        token = generateToken(user);
    });

    beforeEach(async () => {
        await AppDataSource.synchronize(true); // Clear database
    });

    describe('POST /api/journals', () => {
        it('should create a new journal entry', async () => {
            const response = await request(app)
                .post('/api/journals')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Entry',
                    content: 'This is a test entry',
                    mood: 'happy'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Entry');
        });
    });

    describe('GET /api/journals', () => {
        it('should return user journal entries', async () => {
            const response = await request(app)
                .get('/api/journals')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('entries');
            expect(response.body).toHaveProperty('total');
        });
    });
});