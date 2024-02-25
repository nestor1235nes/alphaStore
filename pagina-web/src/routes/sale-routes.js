import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator-midd.js';
import { getSale, getSales, addSale, deleteSale } from '../controllers/sale-controller.js';
import { saleProductSchema } from '../schemas/sale-scheme.js';

const router = Router()

router.get('/sales', authRequired, getSale)
router.get('/sales/:id', authRequired, getSales)
router.post('/sales', authRequired, validateSchema(saleProductSchema), addSale)
router.delete('/sales/:id', authRequired, deleteSale)

export default router;