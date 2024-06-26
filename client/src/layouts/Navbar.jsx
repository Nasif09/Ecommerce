import React from 'react';
import {NavLink} from 'react-router-dom';

const Navbar = () => {
    return (<nav className="flex-center">
        <NavLink to='/' className='nav__link'>Home</NavLink>
        <NavLink to='/register' className='nav__link'>Register</NavLink>
        <NavLink to='/login' className='nav__link'>Login</NavLink>
        <NavLink to='/login' className='nav__link'>LogOut</NavLink>
        <NavLink to='/cart' className='nav__link'>Cart</NavLink>
    </nav>)
};

export default Navbar;