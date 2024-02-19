import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    productCode: {
        type: String,
        required: true,
    },
    productAmount: {
        type: String,
        required: true,
    },
    priceProvider: {
        type: String,
        required: true,
    },
    salePrice: {
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
});

export default mongoose.model("Store", storeSchema);