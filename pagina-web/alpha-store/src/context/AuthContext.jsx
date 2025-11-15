import { createContext, useState, useContext, useEffect } from "react";
import { mockUsers } from '../data/mockData';
import { DEMO_MODE } from '../config/appConfig';

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

    const signup = async (userData) =>{
        if (DEMO_MODE) {
            // Simulación de registro en modo demo
            setTimeout(() => {
                const newUser = {
                    _id: Date.now().toString(),
                    username: userData.username,
                    email: userData.email,
                    createdAt: new Date().toISOString()
                };
                console.log('Usuario registrado (demo):', newUser);
                // No cambiamos el usuario actual en demo
            }, 500);
            return;
        }
        
        try {
            const { registerRequest } = await import('../api/auth');
            const res = await registerRequest(userData);
            console.log(res.data);
            setUser(res.data);
            setisAuthenticated(true);
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
        }
    };

    const signin = async (userData) =>{
        if (DEMO_MODE) {
            // Simulación de login en modo demo
            setTimeout(() => {
                const demoUser = mockUsers[0]; // Usuario admin por defecto
                setisAuthenticated(true);
                setUser(demoUser);
                localStorage.setItem('demoUser', JSON.stringify(demoUser));
            }, 500);
            return;
        }

        try {
            const { loginRequest } = await import('../api/auth');
            const res = await loginRequest(userData);
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
        if (DEMO_MODE) {
            localStorage.removeItem('demoUser');
        }
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
            if (DEMO_MODE) {
                // En modo demo, verificar si hay usuario en localStorage
                const storedUser = localStorage.getItem('demoUser');
                if (storedUser) {
                    setisAuthenticated(true);
                    setUser(JSON.parse(storedUser));
                } else {
                    // Auto-login con usuario demo
                    const demoUser = mockUsers[0];
                    setisAuthenticated(true);
                    setUser(demoUser);
                    localStorage.setItem('demoUser', JSON.stringify(demoUser));
                }
                setLoading(false);
                return;
            }

            const Cookies = await import('js-cookie');
            const cookies = Cookies.default.get();

            if(!cookies.token){
                setisAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
            try {
                const { verifyTokenRequest } = await import('../api/auth');
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