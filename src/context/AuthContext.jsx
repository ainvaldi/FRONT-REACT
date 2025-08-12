import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const userLoged = JSON.parse(localStorage.getItem('user'))
        if(userLoged){
            setUser(userLoged)
        }
    },[])

    const login = async (credentials)=>{
        try {
            const response = await axios.post('http://localhost:3000/auth/login',credentials)
            console.log(response);
            if(response.status === 200){
                const token = response?.data?.token
                const userLogued = response?.data?.user
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(userLogued))                
                setUser(userLogued)
                navigate('/')
            }else{
                alert('Las credenciales son erroneas')
            }
        } catch (error) {
            console.log(error);
            
            alert("Hubo error al iniciar sesion")
        }
    }

    const register = async (userData) =>{
        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData)
            if(response.status === 201){
                alert("Usuario creado exitosamente")
                navigate('/inicio-sesion')
            }else{
                alert(response.message)
            }
        } catch (error) {
            alert("Hubo un error al registrar el usuario")
        }
    }

    const logout = () =>{
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/inicio-sesion')
    }

    return(
        <AuthContext.Provider value={{user, setUser, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}