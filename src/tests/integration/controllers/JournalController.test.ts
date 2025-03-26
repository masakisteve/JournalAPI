import { JournalController } from '../../../controllers/JournalController';
import { AppDataSource } from '../../../data-source';
import { JournalEntry } from '../../../models/JournalEntry';
import { createTestUser, createTestEntry } from '../../helpers/testFactory';

describe('JournalController', () => {
    let testUser: any;
    let testEntry: JournalEntry;

    beforeEach(async () => {
        await AppDataSource.synchronize(true); // Clear database
        testUser = await createTestUser();
        testEntry = await createTestEntry(testUser);
    });

    describe('getEntries', () => {
        it('should return user entries with pagination', async () => {
            const req = {
                user: { userId: testUser.id },
                query: { page: '1', limit: '10' }
            } as any;

            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            } as any;

            await JournalController.getEntries(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    entries: expect.arrayContaining([
                        expect.objectContaining({
                            id: testEntry.id
                        })
                    ]),
                    total: 1
                })
            );
        });
    });
});