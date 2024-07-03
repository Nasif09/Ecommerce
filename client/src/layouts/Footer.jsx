import React from 'react';

const Footer = () => {
    return (
        <footer className='footer flex-space-around'>
            <div className='flex-space-around'>
                <form>
                    <label htmlFor='subscribe'>Subscribe to newsletter:</label>
                    <input
                    type='email'
                    name='subscribe'
                    id='subscribe'
                    placeholder='Your Email address'
                    className='footer__input'
                    />
                    <button type='submit' className='btn__subscribe'>subscribe</button>
                </form>
            </div>

            <div>
                <p> &copy; Copyright 2024 Nasif Rahman. All right reserved</p>
            </div>
        </footer>
    );
};

export default Footer;