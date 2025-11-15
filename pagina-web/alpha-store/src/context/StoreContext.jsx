import { createContext, useContext, useState, useEffect } from "react";
import { mockProducts, generateId } from "../data/mockData";
import { DEMO_MODE } from '../config/appConfig';

export const StoreContext = createContext();

export const useStore = () => {
    const context = useContext(StoreContext); 

    if(!context){
        throw new Error("useStore debe ser usado dentro de StoreProvider");
    }
    return context;
};

export const StoreProvider = ({children}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (DEMO_MODE) {
            // Cargar productos mock desde localStorage o usar los por defecto
            const storedProducts = localStorage.getItem('demoProducts');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(mockProducts);
                localStorage.setItem('demoProducts', JSON.stringify(mockProducts));
            }
        }
    }, []);

    const createProduct = async (product) => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newProduct = {
                        _id: generateId(),
                        ...product,
                        createdAt: new Date().toISOString()
                    };
                    const updatedProducts = [...products, newProduct];
                    setProducts(updatedProducts);
                    localStorage.setItem('demoProducts', JSON.stringify(updatedProducts));
                    resolve({ data: newProduct });
                }, 300);
            });
        }

        const { createProductRequest } = await import("../api/store");
        const res = await createProductRequest(product);
        return res;
    }

    const getProducts = async () => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const storedProducts = localStorage.getItem('demoProducts');
                    const currentProducts = storedProducts ? JSON.parse(storedProducts) : mockProducts;
                    setProducts(currentProducts);
                    resolve(currentProducts);
                }, 200);
            });
        }

        const { getProductsRequest } = await import("../api/store");
        const res = await getProductsRequest(); 
        setProducts(res.data);
        return res.data;
    }

    const getProduct = async (productCode) => {
        if (DEMO_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const storedProducts = localStorage.getItem('demoProducts');
                    const currentProducts = storedProducts ? JSON.parse(storedProducts) : mockProducts;
                    // Manejar tanto string directo como objeto {producto: ...}
                    const code = typeof productCode === 'string' ? productCode : productCode.producto;
                    const product = currentProducts.find(p => p.productCode === code);
                    
                    if (product) {
                        resolve(product);
                    } else {
                        reject(new Error('Producto no encontrado'));
                    }
                }, 200);
            });
        }

        const { getProductRequest } = await import("../api/store");
        const res = await getProductRequest(productCode.producto);
        setProducts(res.data);
        return res.data;
    }

    const deleteProduct = async (productId) => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const storedProducts = localStorage.getItem('demoProducts');
                    const currentProducts = storedProducts ? JSON.parse(storedProducts) : mockProducts;
                    const updatedProducts = currentProducts.filter(p => p._id !== productId);
                    setProducts(updatedProducts);
                    localStorage.setItem('demoProducts', JSON.stringify(updatedProducts));
                    resolve({ data: updatedProducts });
                }, 300);
            });
        }

        const { deleteProductRequest } = await import("../api/store");
        const res = await deleteProductRequest(productId);  
        setProducts(res.data);
        return res.data;
    }

    const editProduct = async (product) => {
        if (DEMO_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const storedProducts = localStorage.getItem('demoProducts');
                    const currentProducts = storedProducts ? JSON.parse(storedProducts) : mockProducts;
                    const updatedProducts = currentProducts.map(p => 
                        p._id === product._id ? { ...p, ...product } : p
                    );
                    setProducts(updatedProducts);
                    localStorage.setItem('demoProducts', JSON.stringify(updatedProducts));
                    resolve({ data: updatedProducts });
                }, 300);
            });
        }

        const { updateProductRequest } = await import("../api/store");
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