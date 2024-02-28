import mongoose from "mongoose";

const saleProductSchema = new mongoose.Schema({
    productName: String,
    productCode: String,
    saleAmount: String,
    priceProvider: String,
    salePrice: String,
    saleTotal: String,
});

const saleSchema = new mongoose.Schema({
    products: [saleProductSchema], // Campo para almacenar los productos
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model("Sale", saleSchema);