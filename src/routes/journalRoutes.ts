import { Router } from 'express';
import { 
    getAllJournals,
    getJournal,
    createJournal,
    updateJournal,
    deleteJournal
} from '../controllers/journalController';

const router = Router();

router.get('/', getAllJournals);
router.get('/:id', getJournal);
router.post('/', createJournal);
router.put('/:id', updateJournal);
router.delete('/:id', deleteJournal);

export default router;