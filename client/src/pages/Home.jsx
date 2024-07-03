import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import CategoriesSilebar from '../components/CategoriesSilebar';
import ProductSidebar from '../components/ProductSidebar';

const Home = () => {
    return (
        <>
            <PageTitle title="Home" />
            <div className='container flex-space-around'>
                <div className='sidebar-container'>
                    <CategoriesSilebar/>
                </div>
                <div className='main-container'>
                    <ProductSidebar/>
                </div>
            </div>
        </>
    );
};

export default Home;
