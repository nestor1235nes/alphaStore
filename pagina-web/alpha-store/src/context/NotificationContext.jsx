import { createContext, useContext, useState } from "react";
import { sendMessageRequest } from "../api/notification";
 
export const NotificationContext = createContext ();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function NotificationProvider ({children}) {
    const [messages, setMessage] = useState([]);

    const sendMessage = async (message) =>{
        const res = await sendMessageRequest(message);
        console.log(res)
    }

    return(
        <NotificationContext.Provider
            value={{
                messages,
                sendMessage
            }}
        >
            {children}

        </NotificationContext.Provider>
    )
}