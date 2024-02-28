import { createContext, useContext, useState } from "react";
import { createSalesRequest, getSaleRequest, getSalesRequest, deleteSaleRequest } from '../api/sale';
import { saleSchema } from "../../../src/schemas/sale-scheme";

export const SaleContext = createContext ();

export const useSale = () => {
    const context = useContext(SaleContext); 

    if(!context){
        throw new Error("deberia ser usados con otra wea");
    }
    return context;

};

export const SaleProvider = ({children}) => {
    const [sales, setSales] = useState([]);

    const createSale = async (saleData) => {
        try {
            const result = await createSalesRequest(saleData);
            return result;
        } catch (error) {
            console.error(error);
        }
        
    
        
    };
    
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