import { createContext, useContext, useState } from "react";
import { createProductRequest, getProductsRequest, updateProductRequest, deleteProductRequest, getProductRequest } from "../api/store";

export const StoreContext = createContext ();

export const useStore = () => {
    const context = useContext(StoreContext); 

    if(!context){
        throw new Error("deberia ser usados con otra wea");
    }
    return context;

};

export const StoreProvider = ({children}) => {
    const [products, setProducts] = useState([]);
    const [data, setData] = useState([]);

    const createProduct = async (product) =>{

        const res = await createProductRequest(product);
        
    }
    const getProducts = async () =>{
        const res =await getProductsRequest(); 
        setProducts(res.data);
        return res.data;

    }
    const getProduct = async (productCode) => {
        const res = await getProductRequest(productCode.producto);

        setProducts(res.data);
        return res.data;

    }
    const deleteProduct = async (product) =>{
        const res = await deleteProductRequest(product);  
        setProducts(res.data);
        return res.data;

    }
    const editProduct = async (product) => {
        const res = await updateProductRequest(product);
        setProducts(res.data);
        return res.data;

    }

    return(
        <StoreContext.Provider
            value={{
                products,
                createProduct,
                getProducts,
                getProduct,
                deleteProduct,
                editProduct
            }}
        >
            {children}

        </StoreContext.Provider>
    )
}