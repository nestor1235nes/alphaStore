import Store from '../models/store-model.js';

export const getProduct = async (req, res) => {
    try {
        // Buscar el producto por el código de barras en lugar del ID
        const product = await Store.findOne({ productCode: req.params.productCode });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const editProduct = async (req, res) => {
    try {
        const product = await Store.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!product) return res.status(404).json({message: "Producto no encontrado"});
        res.json(product);
    } catch (error) {
        return res.status(404).json({message: "Producto no encontrado"});
    }
    
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Store.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({message: "Producto no encontrado"});
        return res.sendStatus(204)
    } catch (error) {
        return res.status(404).json({message: "Producto no encontrado"});
    }
    
};

export const addProduct = async (req, res) => {
    try {
        const { productName , productCode, productAmount, priceProvider, salePrice } = req.body;
        const newProduct = new Store({
            productName, 
            productCode,
            productAmount, 
            priceProvider,
            salePrice,
            user: req.user.id,
        });
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        return res.status(404).json({ message: "No hay productos en la colección" });
    }
    
};
export const showStore = async (req, res) => {
    try {
        const store = await Store.find({
            user:req.user.id
        });

        if (!store) {
            return res.status(404).json({ message: "No hay productos en la colección" });
        }
        console.log(store);
        res.json(store);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
    
}; 

