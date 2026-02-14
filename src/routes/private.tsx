import Cookies from "js-cookie";
import { useEffect, type ReactNode } from "react";

import { useNavigate } from "react-router-dom";
interface PrivateRoutesProps {
    children: ReactNode;
}
const PrivateRoutes = ({children}:PrivateRoutesProps) => {

    const navigate = useNavigate()
    const token = Cookies.get('token')


    useEffect(()=> {
       if(!token){
        navigate('/')
    } 
    },[navigate, token])
    

  return children;
}

export default PrivateRoutes;