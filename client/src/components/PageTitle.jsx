import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const PageTitle = (props) => {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{props.title}</title>
                </Helmet>
            </HelmetProvider>
        </div>
    );
};

export default PageTitle;