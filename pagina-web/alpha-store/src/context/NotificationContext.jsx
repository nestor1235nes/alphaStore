import { createContext, useContext, useState, useEffect } from "react";
import { mockNotifications, generateId } from "../data/mockData";
import { DEMO_MODE } from '../config/appConfig';
 
export const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if(!context){
        throw new Error("useNotification debe ser usado dentro de NotificationProvider");
    }
    return context;
}

export function NotificationProvider ({children}) {
    const [messages, setMessage] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (DEMO_MODE) {
            // Cargar notificaciones mock desde localStorage o usar las por defecto
            const storedNotifications = localStorage.getItem('demoNotifications');
            if (storedNotifications) {
                setData(JSON.parse(storedNotifications));
            } else {
                setData(mockNotifications);
                localStorage.setItem('demoNotifications', JSON.stringify(mockNotifications));
            }
        }
    }, []);

    const sendMessage = async (message) => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newNotification = {
                        _id: generateId(),
                        message: message.message || message,
                        type: message.type || 'info',
                        read: false,
                        createdAt: new Date().toISOString()
                    };
                    
                    const storedNotifications = localStorage.getItem('demoNotifications');
                    const currentNotifications = storedNotifications ? JSON.parse(storedNotifications) : mockNotifications;
                    const updatedNotifications = [newNotification, ...currentNotifications];
                    
                    setData(updatedNotifications);
                    localStorage.setItem('demoNotifications', JSON.stringify(updatedNotifications));
                    resolve({ data: newNotification });
                }, 300);
            });
        }

        const { sendMessageRequest } = await import("../api/notification");
        const res = await sendMessageRequest(message);
        return res;
    }

    const getMessage = async () => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const storedNotifications = localStorage.getItem('demoNotifications');
                    const currentNotifications = storedNotifications ? JSON.parse(storedNotifications) : mockNotifications;
                    setData(currentNotifications);
                    resolve(currentNotifications);
                }, 200);
            });
        }

        const { getMessageRequest } = await import("../api/notification");
        const res = await getMessageRequest();
        setData(res.data);
        return res.data;
    }

    return(
        <NotificationContext.Provider
            value={{
                messages,
                sendMessage,
                getMessage,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}