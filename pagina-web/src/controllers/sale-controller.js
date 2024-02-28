import Sale from '../models/sale-model.js'

export const getSale = async (req, res) => {
    try {
        // Buscar el producto por el código de barras en lugar del ID
        const sale = await Sale.findOne({ productCode: req.params.productCode });

        if (!sale) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(sale);
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
export const getSales = async (req, res) => {
    try {
        const sale = await Sale.find({
            user:req.user.id
        });

        if (!sale) {
            return res.status(404).json({ message: "No hay productos en la colección" });
        }
        console.log(sale);
        res.json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
export const addSale = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No se han proporcionado productos" });
        }

        const newSale = new Sale({
            products: products.map(product => ({
                productName: product.productName,
                productCode: product.productCode,
                saleAmount: product.saleAmount,
                priceProvider: product.priceProvider,
                salePrice: product.salePrice,
                saleTotal: product.saleTotal,
            })),
            user: req.user.id,
        });

        const savedSale = await newSale.save();
        res.json(savedSale);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
export const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if(!sale) return res.status(404).json({message: "Producto no encontrado"});
        return res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({message: "Producto no encontrado"});
    }
}
