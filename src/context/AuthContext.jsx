import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null)
    const navigate = useNavigate()


    const decodeUser = (token)=>{
        try {
            const decoded = jwtDecode(token)
            if(!decoded.exp || decoded.exp * 1000 < Date.now()){
                return null;
            }  
            
            return{
                id: decoded.user.id,
                nombre:decoded.user.nombre,
                email: decoded.user.email,
                edad: decoded.user.edad,
                rol: decoded.user.rol
            }
        } catch {
            return null
        }
    }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token)return

        const userLogued = decodeUser(token)
        if(userLogued){
        setUser(userLogued)
        }else{
            localStorage.removeItem('token')
            setUser(null)
        }
    },[])

    const login = async (credentials)=>{
        try {
            const {data, status} = await authService.login(credentials)
            
            if(status === 200){
                const token = data?.token
                localStorage.setItem('token', token)

                const userLogued = decodeUser(token)

                if(!userLogued){
                    localStorage.removeItem('token')
                    alert("Token invalido o esta expirado")
                    return
                }
                
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
            const {status, message} = await authService.register(userData)
            if(status === 201){
                alert("Usuario creado exitosamente")
                navigate('/inicio-sesion')
            }else{
                alert(message)
            }
        } catch (error) {
            alert("Hubo un error al registrar el usuario")
        }
    }

    const logout = () =>{
        setUser(null)
        localStorage.removeItem('token')
        navigate('/inicio-sesion')
    }

    const forgotPassword = async (email) =>{
        try {
            await authService.forgot(email)
            alert("Revisa tu correo electronico")
            return true;
        } catch (error) {
            console.error(error.response.data || error)
            return false
        }
    }

    const resetPassword = async({id, token, password})=>{
        try {
            const bodyResetPassword={
                id: Number(id),
                token,
                password
            }
            await authService.reset(bodyResetPassword)
            alert("Contraseña actualizada con exito")
            return true
        } catch (error) {
            console.error("Hubo un error al actualizar la contraseña", error.response.data || error)
            return false
        }
    }

    return(
        <AuthContext.Provider value={{user, setUser, register, login, logout, forgotPassword, resetPassword}}>
            {children}
        </AuthContext.Provider>
    )
}