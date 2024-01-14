import Notification from '../models/notification-model.js';


export const getMessage = async (req, res) => {
    try {
        const message = await Notification.find();

        if (!message) {
            return res.status(404).json({ message: "No hay mensajes en la colección" });
        }

        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const sendMessage = async (req, res) => {
    const { name , email , phone, message } = req.body;
    const newMessage = new Notification({
        name, 
        email,
        phone, 
        message,
    });
    
    const savedNotification = await newMessage.save();
    console.log(savedNotification);
    res.json(savedNotification);
};

export const deleteMessage = async (req, res) => {
    const message = await Notification.findByIdAndDelete(req.params.id);
    if(!message) return res.status(404).json({message: "Mensaje no encontrado"});
    return res.sendStatus(204)
};