import { createContext, useContext, useState } from "react";
import { sendMessageRequest, getMessageRequest } from "../api/notification";
 
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
    const [data, setData] = useState([]);

    const sendMessage = async (message) =>{
        const res = await sendMessageRequest(message);
        
    }

    const getMessage = async () =>{
        const res = await getMessageRequest();
        
        setData(res.data);

        return(res.data);
        
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