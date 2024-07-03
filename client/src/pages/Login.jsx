import React from 'react';
import { useRef } from "react";
import "./css/login.css";
// import {Helmet} from "react-helmet";
import PageTitle from '../components/PageTitle';
import {useNavigate} from "react-router-dom";
import axios  from "axios"; 

const Login = () => {
    const email = useRef();
    const password = useRef();
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:3001/api/auth/login", {
                email: email.current.value,
                password: password.current.value
            });
            navigate("/");
            console.log("login");
        }catch(error){
            console.log(error);
        }
    };

    return (
        <>
        <PageTitle title="Login"/>
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Ecommerce</h3>
                    <span className="loginDesc">Please give your email and password</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" 
                            className="loginInput" ref={email} required/>
                        <input placeholder="Password" type="password" minLength="6"
                            className="loginInput" ref={password} required/>
                        <button className="loginButton" type="submit">
                            Log In
                        </button>
                        <span className="loginForgot">Forgot password?</span>
                        <button className="loginRegisterButton">
                            Create a New Account
                        </button>
                    </form>
                </div>
            </div>
        </div></>
    );
};

export default Login;