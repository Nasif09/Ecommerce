import React from 'react';
import "./css/register.css"
// import PageTitle from '../components/PageTitle';
{/* <PageTitle title="Registration"/> */}
import {useNavigate} from "react-router-dom";
import { useRef } from "react";
import axios  from "axios"; 


const Register =() => {
    const name = useRef();
    const email = useRef();
    const password = useRef();
    const address = useRef();
    const phone = useRef();
    const navigate = useNavigate();

    const handleClick = async (e) =>{
        e.preventDefault();
        const user = {
            name: name.current.value,
            email: email.current.value,
            password: password.current.value,
            address: address.current.value,
            phone: phone.current.value,
        }
        try{
            const response = await axios.post("http://localhost:3001/api/users/process-register",user);
            if (response.status === 200 || response.status === 201) {
                window.alert('Go to your email to confirm your registration.');
                navigate('/login');
            }
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">E-commerce</h3>
                <span className="loginDesc">Plese register yourself</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}>
                    <input placeholder="Username" 
                    type="text" 
                    className="loginInput" 
                    ref={name}
                    required
                    />
                    <input placeholder="Email" 
                    type="email" 
                    className="loginInput"
                    ref={email}
                    required
                     />
                    <input placeholder="Password" 
                    type="Password" 
                    className="loginInput" 
                    ref={password}
                    required
                    />
                    <input placeholder="Address" 
                    type="address" 
                    className="loginInput" 
                    ref={address}
                    required
                    />
                    <input placeholder="Phone" 
                    type="phone" 
                    className="loginInput" 
                    ref={phone}
                    required
                    />
                    <button className="loginButton" type="submit">Sign Up</button>
                    <button className="loginRegisterButton">Log into Account</button>
                </form>
            </div>
        </div>
    </div>
  )
}
export default Register;