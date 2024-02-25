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
        const { productName , productCode, saleAmount, priceProvider, salePrice } = req.body;
        const newSale = new Sale({
            productName, 
            productCode,
            saleAmount, 
            priceProvider,
            salePrice,
            user: req.user.id,
        });
        const savedSale = await newSale.save();
        res.json(savedSale);
    } catch (error) {
        return res.status(404).json({ message: "No hay productos en la colección" });
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
