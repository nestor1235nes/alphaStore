import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator-midd.js';
import { getSale, getSales, addSale, deleteSale } from '../controllers/sale-controller.js';
import { saleSchema } from '../schemas/sale-scheme.js';

const router = Router()

router.get('/sale', authRequired, getSales)
router.get('/sale/:id', authRequired, getSale)
router.post('/sale', authRequired, validateSchema(saleSchema),addSale)
router.delete('/sale/:id', authRequired, deleteSale)

export default router;