import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
    },
    productCode: {
        type: String,
        required: true,
    },
    saleAmount: {
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
    date: {
        type: String,
        default: Date.now,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
}, {
    timestamps: true
});

export default mongoose.model("Sale", saleSchema);