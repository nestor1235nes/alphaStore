import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        
    },
    email: {
        type: String,
        require: true,
        trim: true,
        
    },
    phone: { 
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    
})

export default mongoose.model('Notification', notificationSchema)