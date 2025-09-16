import { createContext, useState, useEffect, useContext } from "react";
import productService from "../services/productService";

export const ProductContext = createContext();


export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        page:0,
        q:''
    })
    const [total, setTotal] = useState(null)

    const getProducts = async () => {
        setLoading(true);
        try {
            const page = lazy.page + 1
            const limit = lazy.rows
            const q = lazy.q || ''
            const { data: response } = await productService.listPaged({page, limit, q});
            console.log("Respuesta productos:", response);
            setProducts(Array.isArray(response.data) ? response.data : []);
            setTotal(Number(response?.total || 0))
        } catch (e) {
            setError(e.message);
            setProducts([])
            setTotal(0)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, [lazy.page, lazy.rows, lazy.q]);

    const addProduct = async (newProduct) => {
        setLoading(true);
        try {
            const { data: response } = await productService.create(newProduct);
            const created = Array.isArray(response.data) ? response.data[0] : response.data || response;
            setProducts(prev => Array.isArray(prev) ? [...prev, created] : [created]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const editProduct = async (id, updated) => {
        setLoading(true);
        try {
            await productService.update(id, updated);
            setProducts(prev =>
                prev.map(u => (u.id === id ? { ...updated, id: id } : u)));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productService.remove(id);
            setProducts(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            setError(e.message);
        }
    };


    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                error,
                getProducts,
                addProduct,
                editProduct,
                deleteProduct,
                total,
                lazy,
                setLazy,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    return useContext(ProductContext);
};
