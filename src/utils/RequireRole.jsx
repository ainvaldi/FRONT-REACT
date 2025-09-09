import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const RequireRole = ({roles=[], children}) =>{

    const {user} = useContext(AuthContext)

    if(!user) return <Navigate to="/inicio-sesion" replace/>
    if(roles.length && !roles.includes(user.rol)) return <Navigate to='/' replace/>

    return children

}

