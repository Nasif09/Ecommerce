import React, { useEffect } from 'react';
import Axios from 'axios';
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const getDelete = async () => {
        try {
            await Axios.post("http://localhost:3001/api/auth/logout");
            // console.log("logout");
            // navigate("/login");
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    
    useEffect(() => {
        getDelete();
    }, []);


    return (
        <div>
        </div>
    );
};

export default Logout;