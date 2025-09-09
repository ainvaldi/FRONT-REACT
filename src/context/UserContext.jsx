import { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/usersService";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        try {
            const { data: response } = await usersService.list();
            console.log("Respuesta productos:", response);
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = async (newUser) => {
        setLoading(true);
        try {
            const { data: response } = await usersService.create(newUser);
            const created = Array.isArray(response.data) ? response.data[0] : response.data || response;
            setUsers(prev => Array.isArray(prev) ? [...prev, created] : [created]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const editUser = async (id, updated) => {
        setLoading(true);
        try {
            await usersService.update(id, updated);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...updated, id: id } : u))
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const deleteUser = async (id) => {
        try {
            await usersService.remove(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            setError(e.message);
        }
    };
    

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <UserContext.Provider
            value={{
                users,
                loading,
                error,
                getUsers,
                addUser,
                editUser,
                deleteUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};