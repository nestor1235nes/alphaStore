import { createContext, useContext, useState, useEffect } from "react";
import { mockSales, generateId } from "../data/mockData";
import { DEMO_MODE } from '../config/appConfig';

export const SaleContext = createContext();

export const useSale = () => {
    const context = useContext(SaleContext); 

    if(!context){
        throw new Error("useSale debe ser usado dentro de SaleProvider");
    }
    return context;
};

export const SaleProvider = ({children}) => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        if (DEMO_MODE) {
            // Cargar ventas mock desde localStorage o usar las por defecto
            const storedSales = localStorage.getItem('demoSales');
            if (storedSales) {
                setSales(JSON.parse(storedSales));
            } else {
                setSales(mockSales);
                localStorage.setItem('demoSales', JSON.stringify(mockSales));
            }
        }
    }, []);

    const createSale = async (saleData) => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const total = saleData.products.reduce((sum, p) => 
                        sum + (parseInt(p.salePrice) * parseInt(p.saleAmount)), 0
                    );
                    
                    const newSale = {
                        _id: generateId(),
                        ...saleData,
                        total,
                        user: '1', // Usuario demo
                        createdAt: new Date().toISOString()
                    };
                    
                    const storedSales = localStorage.getItem('demoSales');
                    const currentSales = storedSales ? JSON.parse(storedSales) : mockSales;
                    const updatedSales = [newSale, ...currentSales];
                    
                    setSales(updatedSales);
                    localStorage.setItem('demoSales', JSON.stringify(updatedSales));
                    resolve({ data: newSale });
                }, 300);
            });
        }

        try {
            const { createSalesRequest } = await import('../api/sale');
            const result = await createSalesRequest(saleData);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    
    const getSales = async () => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const storedSales = localStorage.getItem('demoSales');
                    const currentSales = storedSales ? JSON.parse(storedSales) : mockSales;
                    setSales(currentSales);
                    resolve(currentSales);
                }, 200);
            });
        }

        const { getSalesRequest } = await import('../api/sale');
        const res = await getSalesRequest(); 
        setSales(res.data);
        return res.data;
    }

    const getSale = async (saleId) => {
        if (DEMO_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const storedSales = localStorage.getItem('demoSales');
                    const currentSales = storedSales ? JSON.parse(storedSales) : mockSales;
                    const sale = currentSales.find(s => s._id === saleId);
                    
                    if (sale) {
                        resolve(sale);
                    } else {
                        reject(new Error('Venta no encontrada'));
                    }
                }, 200);
            });
        }

        const { getSaleRequest } = await import('../api/sale');
        const res = await getSaleRequest(saleId);
        setSales(res.data);
        return res.data;
    }

    const deleteSale = async (saleId) => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const storedSales = localStorage.getItem('demoSales');
                    const currentSales = storedSales ? JSON.parse(storedSales) : mockSales;
                    const updatedSales = currentSales.filter(s => s._id !== saleId);
                    
                    setSales(updatedSales);
                    localStorage.setItem('demoSales', JSON.stringify(updatedSales));
                    resolve({ data: updatedSales });
                }, 300);
            });
        }

        const { deleteSaleRequest } = await import('../api/sale');
        const res = await deleteSaleRequest(saleId);  
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