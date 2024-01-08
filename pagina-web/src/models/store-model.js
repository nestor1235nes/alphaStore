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
        type: Number,
        required: true,
    },
    priceProvider: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
});

export default mongoose.model("Store", storeSchema);