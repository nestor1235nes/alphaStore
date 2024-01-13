import { createContext, useContext, useState } from "react";
import { createProductRequest } from "../api/store";

const StoreContext = createContext ();

export const useStore = () => {
    const context = useContext(StoreContext);

    if(!context){
        throw new Error("deberia ser usados con otra wea");
    }
    return context;

};

export function StoreProvider ({children}) {
    const [products, setProducts] = useState([]);

    const createProduct = async (product) =>{
        const res = await createProductRequest(product);
        console.log(res)
    }

    return(
        <StoreContext.Provider
            value={{
                products,
                createProduct
            }}
        >
            {children}

        </StoreContext.Provider>
    )
}