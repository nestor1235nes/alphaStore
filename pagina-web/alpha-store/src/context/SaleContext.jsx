import { createContext, useContext, useState } from "react";

export const SaleContext = createContext ();

export const useStore = () => {
    const context = useContext(SaleContext); 

    if(!context){
        throw new Error("deberia ser usados con otra wea");
    }
    return context;

};

export const SaleProvider = ({children}) => {
    const [sales, setSales] = useState([]);

    const createSale = async (product) =>{
        const res = await createSaleRequest(product);
        console.log(res)
    }
    const getSales = async () =>{
        const res =await getSalesRequest(); 
        setSales(res.data);
        return res.data;

    }
    const getSale = async (productCode) => {
        const res = await getSaleRequest(productCode.producto);
        setSales(res.data);
        return res.data;

    }
    const deleteSale = async (sale) =>{
        const res = await deleteSaleRequest(sale);  
        setSales(res.data);
        return res.data;

    }
    return(
        <SaleContext.Provider
            value={{
                sales,
                createSale,
                getSales,
                getSale,
                deleteSale,
            }}
        >
            {children}

        </SaleContext.Provider>
    )
}