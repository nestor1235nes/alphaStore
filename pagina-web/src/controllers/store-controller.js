import Store from '../models/store-model.js';

export const getProduct = async (req, res) => {
    const product = await Store.findById(req.params.id);
    if(!product) return res.status(404).json({message: "Producto no encontrado"});
    res.json(product);
};

export const editProduct = async (req, res) => {
    const product = await Store.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!product) return res.status(404).json({message: "Producto no encontrado"});
    res.json(product);
};

export const deleteProduct = async (req, res) => {
    const product = await Store.findByIdAndDelete(req.params.id);
    if(!product) return res.status(404).json({message: "Producto no encontrado"});
    return res.sendStatus(204)
};

export const addProduct = async (req, res) => {
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
};
export const showStore = async (req, res) => {
    const store = await Store.find({
        user: req.user.id,
    });
    res.json(store);
}; 

