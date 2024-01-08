import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProduct, editProduct, deleteProduct, addProduct, showStore } from "../controllers/store-controller.js";
import { validateSchema } from '../middlewares/validator-midd.js';
import { addProductSchema } from "../schemas/store-schema.js";

const router = Router();
router.get("/store", authRequired, showStore);
router.get("/store/:id", authRequired, getProduct);
router.post("/store", authRequired, validateSchema(addProductSchema), addProduct);
router.delete("/store/:id", authRequired, deleteProduct);
router.put("/store/:id", authRequired, editProduct);

export default router