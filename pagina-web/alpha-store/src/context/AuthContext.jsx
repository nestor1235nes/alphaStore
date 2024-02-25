import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie';


export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) =>{
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setAuthenticated(true);
           
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
        }
    };

    const signin = async (user) =>{
        try {
            const res = await loginRequest(user);
            console.log(res);
            setisAuthenticated(true);
            setUser(res.data);
        } catch (error) {
            console.log(error);
            if(Array.isArray(error.response.data)){
                setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    

    };

    const signout = () => {
        Cookies.remove("token");
        setisAuthenticated(false);
        setUser(null);
        
    };

    useEffect(() => {
        if(errors.length > 0){
             const timer = setTimeout(() => {
                setErrors([])
            }, 4000)
            return () => clearTimeout(timer);
        }

    }, [errors])

    useEffect(() => {
        async function checkLogin (){
            const cookies = Cookies.get();

            if(!cookies.token){
                setisAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
            try {
                const res = await verifyTokenRequest(cookies.token);
                if(!res.data) {
                    setisAuthenticated(false);
                    setLoading(false);
                    return;
                }
                

                setisAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setisAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
            
                
            
        }
        checkLogin();
    }, [])


    return(
        <AuthContext.Provider value ={{
            signup,
            signin,
            signout,
            user,
            isAuthenticated,
            errors,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}